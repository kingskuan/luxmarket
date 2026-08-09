"use client";

import { useEffect, useState } from "react";

/**
 * Live ticker — 跑马灯数据来自 /api/markets (真实数据源 Δ% + 链上状态),
 * 不再有硬编码概率。
 */

interface TickerRow {
  id: string;
  title: string;
  changePct: number;
  direction: "up" | "down" | "flat";
  settled: boolean;
}

const TITLES: Record<string, string> = {
  "porsche-911-week": "PORSCHE 911",
  "ferrari-roma-event": "FERRARI ROMA",
  "rolex-sub-week": "ROLEX SUBMARINER",
  "birkin-25-week": "BIRKIN 25",
  "dunk-low-week": "DUNK PANDA",
  "nike-jordan-1-settling": "AJ1 CHICAGO",
  "pokemon-char-week": "POKÉMON CHARIZARD",
};

export default function LiveTicker() {
  const [rows, setRows] = useState<TickerRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch(`/api/markets?t=${Date.now()}`, { cache: "no-store" });
        const d = await r.json();
        if (d.ok && !cancelled) {
          setRows(
            d.markets.map((mk: any) => ({
              id: mk.id,
              title: TITLES[mk.id] || mk.id,
              changePct: mk.oracle.changePct,
              direction: mk.oracle.direction,
              settled: mk.chain.settled,
            }))
          );
        }
      } catch {
        /* keep last */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const items = rows
    ? rows.map((r) =>
        r.settled
          ? { title: r.title, label: "SETTLED", cls: "text-white/40" }
          : r.direction === "up"
            ? {
                title: r.title,
                label: `▲ +${r.changePct.toFixed(2)}%`,
                cls: "text-emerald-400",
              }
            : r.direction === "down"
              ? {
                  title: r.title,
                  label: `▼ ${r.changePct.toFixed(2)}%`,
                  cls: "text-red-400",
                }
              : { title: r.title, label: `◆ ${r.changePct.toFixed(2)}%`, cls: "text-white/40" }
      )
    : null; // 未加载 → 骨架, 绝不渲染假数据 (硬条件)

  if (!items) {
    return (
      <div className="relative z-[1] overflow-hidden border-y border-white/10 py-4">
        <div className="flex gap-12 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="h-4 w-48 animate-pulse rounded bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-[1] overflow-hidden border-y border-white/10 py-4">
      <div className="flex w-max animate-[scroll_28s_linear_infinite] gap-12 whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-12">
            {items.map((it, i) => (
              <span
                key={`${k}-${i}-${it.title}`}
                className="font-mono text-[13px] text-white/45"
              >
                <b className="font-medium text-lux-gold">{it.title}</b>{" "}
                <span className={it.cls}>{it.label}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
