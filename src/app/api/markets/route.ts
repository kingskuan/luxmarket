import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * ────────────────────────────────────────────────────────────────
 * /api/markets — 全真实数据聚合端点 (硬条件: 全部数据真实且可验证)
 * ────────────────────────────────────────────────────────────────
 * 每个市场返回:
 *   chain   — 链上实时状态 (settleAt / settled / feedReportedAt / priceUp /
 *              referencePrice), 直接读 X Layer 主网合约 getMarket()
 *   oracle  — 真实数据源当前值 + baseline 快照 + Δ% (来源可点击验证)
 *
 * baseline 来源: 2026-08-10 01:44 UTC 由 feed_oracle.py 实际抓取并落盘
 *   (Yahoo Finance 实时报价 / Bob's Watches 二手在售中位价), 见
 *   luxmarket-contracts/tools/data/snapshots.json — 可复现。
 * ────────────────────────────────────────────────────────────────
 */

const CONTRACT = "0xFb7154E06B068031502051D285dE910b16A5aF0D"; // v2 USD₮0
const RPC = "https://xlayerrpc.okx.com";
const GET_MARKET_SIG = "0xc3c95c7b"; // getMarket(bytes32)
const UA_YAHOO = "Mozilla/5.0"; // Yahoo 对完整 Chrome UA 限流 429
const UA_BROWSER =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

/** 市场 → (数据源类型, 参数, baseline 快照值, 来源标签) */
const ORACLES: Record<
  string,
  { src: "yahoo" | "bobs"; symbol?: string; url?: string; baseline: number; source: string }
> = {
  "porsche-911-week": { src: "yahoo", symbol: "P911.DE", baseline: 44.1, source: "Yahoo Finance · P911.DE" },
  "ferrari-roma-event": { src: "yahoo", symbol: "RACE", baseline: 412.26, source: "Yahoo Finance · RACE" },
  "rolex-sub-week": {
    src: "bobs",
    url: "https://www.bobswatches.com/rolex-submariner",
    baseline: 14995,
    source: "Bob's Watches · Submariner median",
  },
  "birkin-25-week": { src: "yahoo", symbol: "RMS.PA", baseline: 1635.5, source: "Yahoo Finance · RMS.PA" },
  "dunk-low-week": { src: "yahoo", symbol: "NKE", baseline: 41.7, source: "Yahoo Finance · NKE" },
  "nike-jordan-1-settling": { src: "yahoo", symbol: "NKE", baseline: 41.7, source: "Yahoo Finance · NKE" },
  "pokemon-char-week": { src: "yahoo", symbol: "NTDOY", baseline: 12.72, source: "Yahoo Finance · NTDOY" },
};

const MARKET_IDS: Record<string, string> = {
  "porsche-911-week": "0x10e55ad5ef2fd3e437ecddb4c23e878382e192e7f5bd620e2fd0c8dc43509a97",
  "ferrari-roma-event": "0x955b74aae0f08eb01134a7c8ff32d7203b172a3f96ccce86711597a3718db7f1",
  "rolex-sub-week": "0x770aa63d053ce0424f9f5aa7b8d259e3afc249b32cac607bec7d1d6178f4031b",
  "birkin-25-week": "0xcdbff3ee2a706880bf78afcbe3f50717d50a8ee47b1d9079ed8bb4a8c5930d1a",
  "dunk-low-week": "0x8410dbce3b086a86871cd0c32fbe0d0527076bc2be8569f27f063355702f51e1",
  "nike-jordan-1-settling": "0x71429fd2e5cbad363e7c6026ae402bcba0e996a0abaec639b5c0cf5b0c94d52d",
  "pokemon-char-week": "0xc212165eb7e131cc48fb9fd11dbe652c6ea1f2c3d6c9cadd52e13826b75ebf24",
};

// ── 链上读取 (eth_call + 手动 ABI 解码, 17 字段 struct) ──

async function ethCall(data: string): Promise<string> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: CONTRACT, data }, "latest"],
    }),
    cache: "no-store",
  });
  const d = await res.json();
  if (d.error) throw new Error(`eth_call: ${JSON.stringify(d.error)}`);
  return d.result as string;
}

async function getMarketState(marketId: string) {
  const raw = await ethCall(GET_MARKET_SIG + marketId.slice(2));
  const b = Buffer.from(raw.slice(2), "hex");
  // 布局: 0=tuple偏移; 1=id; 2..4=string偏移; 5=referencePrice; 6=createdAt;
  // 7=settleAt; 8..11=q/pool; 12=settled; 13=outcomeUp; 14=oracle; 15=feedReportedAt
  const w = (i: number) =>
    Number(BigInt("0x" + b.subarray(i * 32 + 24, i * 32 + 32).toString("hex")));
  return {
    referencePrice: w(5), // 6dp
    settleAt: w(7),
    settled: b[12 * 32 + 31] === 1,
    outcomeUp: b[13 * 32 + 31] === 1,
    feedReportedAt: w(15),
  };
}

// ── 数据源实时抓取 ──

async function fetchYahoo(symbol: string): Promise<number> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5d&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": UA_YAHOO }, cache: "no-store" });
  if (!res.ok) throw new Error(`yahoo ${symbol} ${res.status}`);
  const d = await res.json();
  return Number(d.chart.result[0].meta.regularMarketPrice);
}

async function fetchBobs(url: string): Promise<number> {
  const res = await fetch(url, { headers: { "User-Agent": UA_BROWSER }, cache: "no-store" });
  if (!res.ok) throw new Error(`bobs ${res.status}`);
  const html = await res.text();
  const prices = [...html.matchAll(/itemprop="price"\s+content="([0-9.]+)"/g)]
    .map((m) => Number(m[1]))
    .filter((p) => p >= 5000 && p <= 300000);
  if (prices.length === 0) throw new Error("bobs: no prices");
  prices.sort((a, b) => a - b);
  const mid = prices[Math.floor(prices.length / 2)];
  return mid;
}

// ── GET ──

export async function GET() {
  try {
    const entries = Object.entries(MARKET_IDS);
    const markets = [];
    for (const [id, marketId] of entries) {
      const o = ORACLES[id];
      // 链上
      const chain = await getMarketState(marketId);
      // 数据源当前值
      const current =
        o.src === "yahoo" ? await fetchYahoo(o.symbol!) : await fetchBobs(o.url!);
      const changePct = ((current - o.baseline) / o.baseline) * 100;
      const direction =
        changePct > 0.05 ? "up" : changePct < -0.05 ? "down" : "flat";
      markets.push({
        id,
        chain: {
          settleAt: chain.settleAt,
          settled: chain.settled,
          outcomeUp: chain.outcomeUp,
          feedReportedAt: chain.feedReportedAt,
          referencePrice: chain.referencePrice / 1e6, // 转回 6dp 显示
        },
        oracle: {
          source: o.source,
          baseline: o.baseline,
          baselineAt: "2026-08-10T01:44:00Z",
          current,
          changePct: Number(changePct.toFixed(2)),
          direction,
        },
      });
    }
    return NextResponse.json({ ok: true, fetchedAt: new Date().toISOString(), markets });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
