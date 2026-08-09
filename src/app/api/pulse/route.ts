import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface PulseItem {
  title: string;
  source: string;
  date: string;
  market?: string; // market id this news maps to
  asset: string; // asset class label
  direction: "bullish" | "bearish" | "neutral";
  reason: string;
}

// keyword → market mapping + directional cues
const ASSET_MAP: {
  market: string;
  asset: string;
  keywords: string[];
  bull: string[];
  bear: string[];
}[] = [
  {
    market: "porsche-911-week",
    asset: "Porsche",
    keywords: ["porsche", "911", "classic car", "collector car", "hagerty"],
    bull: ["surge", "record", "soar", "rise", "high demand", "appreciat", "all-time high", "rally"],
    bear: ["drop", "fall", "decline", "cooling", "slowdown", "weak demand", "correction", "plunge"],
  },
  {
    market: "ferrari-roma-event",
    asset: "Ferrari",
    keywords: ["ferrari", "monterey", "auction"],
    bull: ["record", "soar", "surge", "high demand", "hammer", "sold", "top price", "rally"],
    bear: ["unsold", "below estimate", "drop", "fall", "weak", "cooling", "plunge"],
  },
  {
    market: "rolex-sub-week",
    asset: "Rolex",
    keywords: ["rolex", "submariner", "watch", "timepiece", "wristwatch", "luxury watch"],
    bull: ["surge", "rise", "demand", "waitlist", "appreciat", "record", "soar", "shortage", "tight"],
    bear: ["drop", "fall", "decline", "cooling", "resale slump", "correction", "slump", "weak"],
  },
  {
    market: "birkin-25-week",
    asset: "Hermès",
    keywords: ["hermes", "birkin", "kelly", "fashion house", "luxury group", "lvmh"],
    bull: ["acquire", "acquisition", "takeover", "price increase", "raise", "surge", "demand", "invest", "growth", "record"],
    bear: ["layoff", "slowdown", "slump", "decline", "drop", "cut", "weak demand", "disappoint"],
  },
  {
    market: "birkin-25-week",
    asset: "LVMH / LV",
    keywords: ["louis vuitton", "lvmh", "lv ", " lv", "moet hennessy", "arnault", "acquire", "acquisition", "takeover"],
    bull: ["acquire", "acquisition", "takeover", "surge", "record", "growth", "soar", "invest"],
    bear: ["layoff", "slowdown", "slump", "decline", "drop", "disappoint", "weak"],
  },
  {
    market: "dunk-low-week",
    asset: "Sneakers",
    keywords: ["nike", "sneaker", "stockx", "dunk", "jordan", "resale", "sneakers"],
    bull: ["surge", "rise", "demand", "record", "soar", "appreciat", "sell out", "hype"],
    bear: ["drop", "fall", "decline", "restock", "slump", "cooling", "weak", "price cut"],
  },
  {
    market: "pokemon-char-week",
    asset: "Pokémon",
    keywords: ["pokemon", "pokémon", "charizard", "pikachu", "nintendo", "tcg", "trading card", "card market", "prismatic", "pokemon cards"],
    bull: ["surge", "record", "soar", "demand", "sell out", "hype", "price increase", "rally", "high"],
    bear: ["drop", "fall", "decline", "restock", "slump", "cooling", "weak", "reprint", "price cut"],
  },
  {
    market: "rolex-sub-week",
    asset: "Fine Watches",
    keywords: ["cartier", "patek philippe", "audemars piguet", "richard mille", "omega", "chrono24", "watch market", "luxury watch"],
    bull: ["surge", "rise", "demand", "waitlist", "appreciat", "record", "soar", "shortage", "rally"],
    bear: ["drop", "fall", "decline", "cooling", "slump", "correction", "weak"],
  },
  {
    market: "birkin-25-week",
    asset: "Luxury Fashion",
    keywords: ["chanel", "gucci", "dior", "fashion", "couture", "luxury goods", "retail", "boutique", "handbag"],
    bull: ["surge", "rise", "demand", "record", "soar", "growth", "price increase", "raise", "rally"],
    bear: ["drop", "fall", "decline", "slowdown", "slump", "weak", "cut", "layoff", "discount"],
  },
  {
    market: "ferrari-roma-event",
    asset: "Auction & Art",
    keywords: ["auction", "sotheby", "christie", "fine art", "collector", "concours", "rare", "one-off", "commission"],
    bull: ["record", "hammer", "sold", "soar", "surge", "high demand", "top price", "estimate", "million"],
    bear: ["unsold", "below estimate", "drop", "fall", "weak", "cooling", "plunge"],
  },
];

function classify(title: string, lower: string, entry: (typeof ASSET_MAP)[number]) {
  const bulls = entry.bull.filter((w) => lower.includes(w));
  const bears = entry.bear.filter((w) => lower.includes(w));
  if (bulls.length > bears.length)
    return { direction: "bullish" as const, reason: `signal: ${bulls[0]}` };
  if (bears.length > bulls.length)
    return { direction: "bearish" as const, reason: `signal: ${bears[0]}` };
  return { direction: "neutral" as const, reason: "news mentions asset, no clear signal" };
}

export async function GET(req: NextRequest) {
  // 主题池: 每次请求轮换不同的查询词组合 → 新闻永不重复、一直有新内容
  const THEMES = [
    "luxury watch OR hermes OR LV OR porsche OR nike sneaker",
    "pokemon cards OR charizard OR nintendo OR trading card market",
    "chanel OR cartier OR patek philippe OR luxury goods OR fashion",
    "auction OR sotheby OR christie OR fine art OR collector car OR ferrari",
    "rolex OR submariner OR audemars OR richard mille OR watch market",
    "birkin OR hermes OR gucci OR dior OR luxury retail OR handbag",
  ];
  const q =
    req.nextUrl.searchParams.get("q") ||
    THEMES[Math.floor(Math.random() * THEMES.length)];
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`RSS fetch ${res.status}`);
    const xml = await res.text();

    // parse <item> blocks — 抓 20 条, 但只保留前 10 条已匹配/未匹配的
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 20);
    const pulses: PulseItem[] = [];
    const seen = new Set<string>();

    for (const [, body] of items) {
      const titleMatch = body.match(/<title>(.*?)<\/title>/);
      const dateMatch = body.match(/<pubDate>(.*?)<\/pubDate>/);
      if (!titleMatch) continue;
      const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
      // 去重: 同一标题不重复展示
      const key = title.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seen.has(key)) continue;
      seen.add(key);
      const lower = title.toLowerCase();

      let matched = false;
      for (const entry of ASSET_MAP) {
        if (entry.keywords.some((k) => lower.includes(k))) {
          const { direction, reason } = classify(title, lower, entry);
          pulses.push({
            title,
            source: "Google News",
            date: dateMatch ? dateMatch[1] : "",
            market: entry.market,
            asset: entry.asset,
            direction,
            reason,
          });
          matched = true;
          break;
        }
      }
      if (!matched && pulses.length < 3) {
        pulses.push({
          title,
          source: "Google News",
          date: dateMatch ? dateMatch[1] : "",
          asset: "Luxury",
          direction: "neutral",
          reason: "luxury industry news",
        });
      }
    }

    // 按发布时间倒序 (最新在前)
    pulses.sort((a, b) => {
      const ta = a.date ? Date.parse(a.date) : 0;
      const tb = b.date ? Date.parse(b.date) : 0;
      return tb - ta;
    });

    return NextResponse.json({
      ok: true,
      items: pulses.slice(0, 10),
      theme: q,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
