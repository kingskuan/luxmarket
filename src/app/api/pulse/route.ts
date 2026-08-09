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
  const q = req.nextUrl.searchParams.get("q") || "luxury watch OR hermes OR LV OR porsche OR nike sneaker";
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`RSS fetch ${res.status}`);
    const xml = await res.text();

    // parse <item> blocks
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 12);
    const pulses: PulseItem[] = [];

    for (const [, body] of items) {
      const titleMatch = body.match(/<title>(.*?)<\/title>/);
      const dateMatch = body.match(/<pubDate>(.*?)<\/pubDate>/);
      if (!titleMatch) continue;
      const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
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

    return NextResponse.json({ ok: true, items: pulses });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
