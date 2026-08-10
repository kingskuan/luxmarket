"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { encodeFunctionData, parseAbi } from "viem";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Market, MARKETS as MARKETS_ALL } from "../lib/markets";
import { LUXMARKET_ADDRESS, USDT_ADDRESS, MARKET_IDS } from "../lib/chain";
import { LUXMARKET_ABI } from "../lib/abi";
import { useWeb3 } from "./Web3Provider";

/** /api/markets 实时数据 (硬条件: 全部来自链上 + 真实数据源) */
interface LiveMarket {
  id: string;
  chain: {
    settleAt: number;
    settled: boolean;
    outcomeUp: boolean;
    feedReportedAt: number;
    referencePrice: number; // 6dp 转回的显示值
  };
  oracle: {
    source: string;
    baseline: number;
    baselineAt: string;
    current: number;
    changePct: number;
    direction: "up" | "down" | "flat";
  };
}

function fmt(n: number, dp = 0) {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: dp,
    minimumFractionDigits: dp,
  });
}

const CAT_STYLE: Record<string, string> = {
  Car: "text-lux-gold",
  Watch: "text-emerald-400",
  Goods: "text-purple-400",
  Sneaker: "text-amber-400",
  Collectible: "text-pink-400",
};

const USDT_ABI = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
]);

function deriveStatus(live?: LiveMarket): "open" | "settling" | "closed" {
  if (!live) return "open";
  if (live.chain.settled) return "closed";
  if (live.chain.feedReportedAt > 0) return "settling";
  return "open";
}

function MarketCard({ m, live }: { m: Market; live?: LiveMarket }) {
  const { address, connect, walletClient, publicClient } = useWeb3();
  const [side, setSide] = useState<"up" | "down" | null>(null);
  const [amount, setAmount] = useState("10");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [chainPrice, setChainPrice] = useState<number | null>(null);
  const [costEstimate, setCostEstimate] = useState<{
    up: number;
    down: number;
  } | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  // 我的份额 (1e18 shares)
  const [myUp, setMyUp] = useState<number>(0);
  const [myDown, setMyDown] = useState<number>(0);

  const marketId = MARKET_IDS[m.id];
  const status = deriveStatus(live);

  // read on-chain price + cost estimate
  useEffect(() => {
    if (!publicClient || !marketId) return;
    let cancelled = false;
    publicClient
      .readContract({
        address: LUXMARKET_ADDRESS,
        abi: LUXMARKET_ABI,
        functionName: "priceUp",
        args: [marketId],
      })
      .then((v) => {
        if (!cancelled) setChainPrice(Number(v) / 1e18);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [publicClient, marketId]);

  // live cost estimate: costToBuy(marketId, isUp, shares) → 6dp USDT
  useEffect(() => {
    if (!publicClient || !marketId) {
      setCostEstimate(null);
      return;
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setCostEstimate(null);
      return;
    }
    const shares = BigInt(Math.round(amt * 1e18));
    let cancelled = false;
    const fetchCost = async () => {
      try {
        const up = await publicClient.readContract({
          address: LUXMARKET_ADDRESS,
          abi: LUXMARKET_ABI,
          functionName: "costToBuy",
          args: [marketId, true, shares],
        });
        const down = await publicClient.readContract({
          address: LUXMARKET_ADDRESS,
          abi: LUXMARKET_ABI,
          functionName: "costToBuy",
          args: [marketId, false, shares],
        });
        if (!cancelled)
          setCostEstimate({ up: Number(up) / 1e6, down: Number(down) / 1e6 });
      } catch {
        if (!cancelled) setCostEstimate(null);
      }
    };
    fetchCost();
    return () => {
      cancelled = true;
    };
  }, [publicClient, marketId, amount]);

  // read my shares (sharesUp/sharesDown mapping getter)
  useEffect(() => {
    if (!publicClient || !marketId || !address) {
      setMyUp(0);
      setMyDown(0);
      return;
    }
    let cancelled = false;
    const loadShares = async () => {
      try {
        const [up, down] = await Promise.all([
          publicClient.readContract({
            address: LUXMARKET_ADDRESS,
            abi: LUXMARKET_ABI,
            functionName: "sharesUp",
            args: [marketId, address],
          }),
          publicClient.readContract({
            address: LUXMARKET_ADDRESS,
            abi: LUXMARKET_ABI,
            functionName: "sharesDown",
            args: [marketId, address],
          }),
        ]);
        if (!cancelled) {
          setMyUp(Number(up) / 1e18);
          setMyDown(Number(down) / 1e18);
        }
      } catch {
        if (!cancelled) {
          setMyUp(0);
          setMyDown(0);
        }
      }
    };
    loadShares();
    return () => {
      cancelled = true;
    };
  }, [publicClient, marketId, address]);

  // UP 概率 = 链上 LMSR 市场定价 (真实); 无连接时回退 50% 并标注
  const upPct = chainPrice !== null ? Math.round(chainPrice * 100) : 50;
  const downPct = 100 - upPct;
  const payout = (s: "up" | "down", amt: number) => {
    const p = s === "up" ? upPct / 100 : downPct / 100;
    if (p <= 0) return 0;
    return amt / p;
  };

  const closed = status === "closed";
  const oracle = live?.oracle;
  const settleLabel = live
    ? new Date(live.chain.settleAt * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "…";

  const sendTx = useCallback(
    async (to: `0x${string}`, data: `0x${string}`) => {
      if (!walletClient || !address) throw new Error("wallet not connected");
      const hash = await walletClient.sendTransaction({
        to,
        data,
      } as never);
      return hash;
    },
    [walletClient, address]
  );

  const handleTrade = async (s: "up" | "down") => {
    setTxError(null);
    if (!address) {
      await connect();
      return;
    }
    if (!marketId) {
      setTxError("This market is not deployed on-chain yet.");
      return;
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setTxError("Enter a valid amount.");
      return;
    }
    const shares = BigInt(Math.round(amt * 1e18));
    setSide(s);
    setIsPending(true);
    try {
      // 1) approve USDT0
      const approveData = encodeFunctionData({
        abi: USDT_ABI,
        functionName: "approve",
        args: [LUXMARKET_ADDRESS, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
      });
      const approveHash = await sendTx(USDT_ADDRESS, approveData);
      setTxHash(approveHash);
      if (publicClient) await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // 2) buy
      const buyData = encodeFunctionData({
        abi: LUXMARKET_ABI,
        functionName: "buy",
        args: [marketId, s === "up", shares],
      });
      const buyHash = await sendTx(LUXMARKET_ADDRESS, buyData);
      setTxHash(buyHash);
    } catch (e) {
      setTxError((e as Error).message.slice(0, 140));
    } finally {
      setIsPending(false);
    }
  };

  /** 卖出: sell(id, isUp, shares) — 份额按当前 LMSR 价退款 */
  const handleSell = async (s: "up" | "down") => {
    setTxError(null);
    if (!address) {
      await connect();
      return;
    }
    if (!marketId) return;
    const held = s === "up" ? myUp : myDown;
    if (held <= 0) return;
    const shares = BigInt(Math.round(held * 1e18));
    setSide(s);
    setIsPending(true);
    try {
      const sellData = encodeFunctionData({
        abi: LUXMARKET_ABI,
        functionName: "sell",
        args: [marketId, s === "up", shares],
      });
      const hash = await sendTx(LUXMARKET_ADDRESS, sellData);
      setTxHash(hash);
      // 乐观清零, 下次刷新会重新读链上
      if (s === "up") setMyUp(0);
      else setMyDown(0);
    } catch (e) {
      setTxError((e as Error).message.slice(0, 140));
    } finally {
      setIsPending(false);
    }
  };

  /** 赎回: redeem(id) — 结算后按 outcome 领取 */
  const handleRedeem = async () => {
    setTxError(null);
    if (!address) {
      await connect();
      return;
    }
    if (!marketId) return;
    if (myUp <= 0 && myDown <= 0) {
      setTxError("You hold no winning shares to redeem.");
      return;
    }
    setIsPending(true);
    try {
      const redeemData = encodeFunctionData({
        abi: LUXMARKET_ABI,
        functionName: "redeem",
        args: [marketId],
      });
      const hash = await sendTx(LUXMARKET_ADDRESS, redeemData);
      setTxHash(hash);
      setMyUp(0);
      setMyDown(0);
    } catch (e) {
      setTxError((e as Error).message.slice(0, 140));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.045] to-white/[0.012] transition-all duration-300 hover:-translate-y-1.5 hover:border-lux-gold/50 hover:shadow-[0_20px_60px_rgba(212,175,55,0.12)]">
      {/* image header */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={m.image}
          alt={m.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-black/40 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm">
            {m.category}
          </span>
          <span
            className={`rounded px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-sm ${
              status === "open"
                ? "bg-emerald-500/25 text-emerald-300"
                : status === "settling"
                  ? "bg-amber-500/25 text-amber-300"
                  : "bg-white/20 text-white/70"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <div className={`text-[10px] uppercase tracking-[0.3em] ${CAT_STYLE[m.category]}`}>
            {m.category}
          </div>
          <h3 className="mt-1 text-xl font-bold leading-tight">{m.title}</h3>
          {oracle && (
            <div className="mt-1 font-mono text-2xl font-medium">
              ${fmt(oracle.current, oracle.current < 100 ? 2 : 0)}
              <span className="ml-2 text-xs font-normal text-white/40">
                {oracle.source}
              </span>
              <span
                className={`ml-2 text-xs font-bold ${
                  oracle.changePct > 0.05
                    ? "text-emerald-400"
                    : oracle.changePct < -0.05
                      ? "text-red-400"
                      : "text-white/40"
                }`}
              >
                {oracle.changePct > 0 ? "+" : ""}
                {oracle.changePct.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between text-xs">
          <span className="text-emerald-400">
            UP {upPct}%{" "}
            {chainPrice !== null && (
              <span className="text-[10px] text-emerald-500/50">on-chain</span>
            )}
          </span>
          <span className="text-red-400">DOWN {downPct}%</span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded bg-white/10">
          <div
            className="h-full rounded bg-gradient-to-r from-emerald-400 to-lux-gold"
            style={{ width: `${upPct}%` }}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-white/45">
          {oracle ? (
            <>
              <span className="font-semibold text-white/70">Oracle: </span>
              {oracle.current.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
              vs baseline {oracle.baseline.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              {" · "}
              <span className="text-white/30">settle {settleLabel}</span>
            </>
          ) : (
            <span className="text-white/30">loading live oracle data…</span>
          )}
        </p>

        {/* 结算状态可视化 */}
        {live && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
            {live.chain.settled ? (
              <span className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white/70">
                ✓ settled {live.chain.outcomeUp ? "UP" : "DOWN"} won
              </span>
            ) : live.chain.feedReportedAt > 0 ? (
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-amber-300">
                ⏳ outcome fed · dispute window (24h)
              </span>
            ) : (
              <span className="rounded border border-emerald-500/30 bg-emerald-500/5 px-1.5 py-0.5 text-emerald-300/80">
                ● open · trading until {settleLabel}
              </span>
            )}
            {live.chain.feedReportedAt > 0 && (
              <span className="text-white/30">
                fed {new Date(live.chain.feedReportedAt * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        )}

        {closed ? (
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-white/5 py-2 text-center text-sm text-white/50">
              Market settled {live?.chain.outcomeUp ? "→ UP won" : "→ DOWN won"}
            </div>
            {address && (myUp > 0 || myDown > 0) && (
              <button
                onClick={handleRedeem}
                disabled={isPending}
                className="w-full rounded-lg bg-lux-gold py-2.5 text-xs font-bold text-black transition hover:opacity-90 disabled:opacity-50"
              >
                REDEEM my winnings → (USD₮0)
              </button>
            )}
            {address && myUp <= 0 && myDown <= 0 && (
              <div className="text-center text-[11px] text-white/35">
                No shares held — nothing to redeem.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-20 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm font-mono outline-none focus:border-lux-gold/60"
              />
              <span className="text-xs text-white/40">USD₮0</span>
              <div className="flex flex-1 gap-2">
                <button
                  onClick={() => handleTrade("up")}
                  disabled={isPending}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition disabled:opacity-50 ${
                    side === "up"
                      ? "bg-emerald-500 text-black"
                      : "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  BUY UP
                </button>
                <button
                  onClick={() => handleTrade("down")}
                  disabled={isPending}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition disabled:opacity-50 ${
                    side === "down"
                      ? "bg-red-500 text-black"
                      : "border border-red-500/40 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  BUY DOWN
                </button>
              </div>
            </div>

            {!address && (
              <div className="text-center text-[11px] text-white/40">
                Click BUY to connect wallet first
              </div>
            )}

            {/* 我的份额 + 卖出 */}
            {address && (myUp > 0 || myDown > 0) && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                <div className="mb-1.5 text-[10px] uppercase tracking-widest text-white/40">
                  My position
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-3 text-[11px]">
                    {myUp > 0 && (
                      <span className="text-emerald-400">
                        UP {myUp.toFixed(2)} shares
                      </span>
                    )}
                    {myDown > 0 && (
                      <span className="text-red-400">
                        DOWN {myDown.toFixed(2)} shares
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {myUp > 0 && (
                      <button
                        onClick={() => handleSell("up")}
                        disabled={isPending}
                        className="rounded border border-emerald-500/40 px-2 py-1 text-[10px] font-bold text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        SELL UP
                      </button>
                    )}
                    {myDown > 0 && (
                      <button
                        onClick={() => handleSell("down")}
                        disabled={isPending}
                        className="rounded border border-red-500/40 px-2 py-1 text-[10px] font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        SELL DOWN
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-[10px] text-white/30">
                  Sells at the live LMSR price before settlement.
                </div>
              </div>
            )}

            {costEstimate && (
              <div className="rounded-lg bg-white/5 p-2 text-[10px] text-white/45">
                On-chain cost for {amount} shares → UP{" "}
                <span className="font-mono text-emerald-400">
                  ≈{costEstimate.up.toFixed(2)}
                </span>{" "}
                / DOWN{" "}
                <span className="font-mono text-red-400">
                  ≈{costEstimate.down.toFixed(2)}
                </span>{" "}
                USD₮0
              </div>
            )}

            {isPending && (
              <div className="rounded-lg bg-white/5 p-2 text-center text-[11px] text-white/60">
                Waiting for wallet confirmation…
              </div>
            )}

            {txHash && (
              <div className="rounded-lg border border-lux-gold/30 bg-lux-gold/5 p-2 text-[11px]">
                <span className="text-white/60">Tx: </span>
                <a
                  href={`https://www.okx.com/web3/explorer/xlayer/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-lux-gold"
                >
                  {txHash.slice(0, 10)}…{txHash.slice(-6)}
                </a>
              </div>
            )}

            {txError && (
              <div className="rounded-lg bg-red-500/10 p-2 text-[11px] text-red-400">
                {txError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<Record<string, LiveMarket> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // 每 60s 刷新 /api/markets (链上 + 真实数据源)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch(`/api/markets?t=${Date.now()}`, { cache: "no-store" });
        const d = await r.json();
        if (d.ok && !cancelled) {
          const map: Record<string, LiveMarket> = {};
          for (const mk of d.markets) map[mk.id] = mk;
          setLive(map);
        } else if (!cancelled) setErr(d.error || "failed");
      } catch (e) {
        if (!cancelled) setErr((e as Error).message);
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // stagger-reveal cards on scroll into view
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.querySelectorAll(":scope > div"),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        }
      );
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      {err && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-400">
          Live oracle data unavailable: {err}
        </div>
      )}
      <div ref={gridRef} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {MARKETS_ALL.map((m) => (
          <MarketCard key={m.id} m={m} live={live?.[m.id]} />
        ))}
      </div>
    </div>
  );
}
