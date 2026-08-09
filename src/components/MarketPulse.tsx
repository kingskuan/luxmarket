"use client";

import { useEffect, useState } from "react";

interface PulseItem {
  title: string;
  source: string;
  date: string;
  market?: string;
  asset: string;
  direction: "bullish" | "bearish" | "neutral";
  reason: string;
}

const DIR_STYLE: Record<string, { badge: string; text: string; arrow: string }> = {
  bullish: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    text: "text-emerald-400",
    arrow: "▲",
  },
  bearish: {
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    text: "text-red-400",
    arrow: "▼",
  },
  neutral: {
    badge: "bg-white/10 text-white/50 border-white/15",
    text: "text-white/50",
    arrow: "◆",
  },
};

export default function MarketPulse() {
  const [items, setItems] = useState<PulseItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pulse")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setItems(d.items);
        else setError(d.error);
      })
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <section className="relative z-[1] mx-auto max-w-6xl px-6 pb-20 sm:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-[0.4em] text-white/40">
          AI Market Pulse
        </h2>
        <span className="text-[10px] text-white/30">
          live luxury news · auto-linked to markets
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          Pulse feed unavailable: {error}
        </div>
      )}

      {!items && !error && (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {items && (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((it, i) => {
            const st = DIR_STYLE[it.direction];
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-lux-gold/30"
              >
                <span
                  className={`mt-0.5 shrink-0 rounded border px-2 py-1 text-[10px] font-bold uppercase ${st.badge}`}
                >
                  {st.arrow} {it.direction}
                </span>
                <div className="min-w-0">
                  <div className="text-sm leading-snug text-white/80">
                    {it.title}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-white/35">
                    <span className="font-semibold text-lux-gold/80">
                      {it.asset}
                    </span>
                    <span className={`${st.text}`}>{it.reason}</span>
                    {it.date && (
                      <span>
                        {new Date(it.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
