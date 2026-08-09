"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Live Oracle Board — 真实数据源面板 (硬条件: 无任何硬编码行情数据)
 * 每个市场显示: 数据源当前值 / baseline 快照 / Δ% / 来源 / 链上结算时间。
 * 数据全部来自 /api/markets (Yahoo Finance 实时报价 + Bob's Watches 实时中位价
 * + X Layer 链上合约状态), 每 60s 自动刷新。
 */

interface LiveOracle {
  id: string;
  source: string;
  baseline: number;
  baselineAt: string;
  current: number;
  changePct: number;
  direction: "up" | "down" | "flat";
  settleLabel: string;
}

const TITLES: Record<string, string> = {
  "porsche-911-week": "Porsche 911 (991.2)",
  "ferrari-roma-event": "Ferrari Roma",
  "rolex-sub-week": "Rolex Submariner 126610",
  "birkin-25-week": "Hermès Birkin 25 Togo",
  "dunk-low-week": "Nike Dunk Low 'Panda'",
  "nike-jordan-1-settling": "Air Jordan 1 'Chicago'",
  "pokemon-char-week": "Pokémon Charizard (151)",
};

function fmt(n: number, dp = 2) {
  return n.toLocaleString("en-US", {
    maximumFractionDigits: dp,
    minimumFractionDigits: dp,
  });
}

export default function MarketShare() {
  const rootRef = useRef<HTMLElement>(null);
  const [rows, setRows] = useState<LiveOracle[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
              source: mk.oracle.source,
              baseline: mk.oracle.baseline,
              baselineAt: mk.oracle.baselineAt,
              current: mk.oracle.current,
              changePct: mk.oracle.changePct,
              direction: mk.oracle.direction,
              settleLabel: new Date(mk.chain.settleAt * 1000).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              ),
            }))
          );
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

  // reveal animation
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !rows || rows.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll(".oracle-row"),
        { x: -24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [rows]);

  return (
    <section
      ref={rootRef}
      id="share"
      className="relative z-[1] mx-auto max-w-6xl px-6 py-24 sm:px-10"
    >
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-white/40">
          Live Oracle Board
        </div>
        <h2 className="mt-3 text-4xl font-medium leading-tight tracking-[-2px] sm:text-5xl">
          Real prices. <span className="text-lux-gold">Verifiable</span> on-chain.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/40">
          Every number below is fetched live — share prices from Yahoo Finance,
          watch prices from Bob's Watches listings, settlement states from the
          LuXMarket contract on X Layer. Refreshes every 60s.
        </p>
      </div>

      {err && (
        <div className="mx-auto mb-6 max-w-3xl rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-400">
          Oracle board unavailable: {err}
        </div>
      )}

      {!rows && !err && (
        <div className="mx-auto max-w-3xl space-y-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {rows && (
        <div className="mx-auto max-w-3xl space-y-2">
          {rows.map((r) => {
            const up = r.direction === "up";
            const down = r.direction === "down";
            return (
              <div
                key={r.id}
                className="oracle-row flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <div className="w-44 shrink-0">
                  <div className="text-sm font-semibold text-white/85">
                    {TITLES[r.id] || r.id}
                  </div>
                  <div className="mt-0.5 truncate text-[10px] text-white/35">
                    {r.source}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-mono text-lg">
                    <span className="text-lux-gold">
                      ${fmt(r.current, r.current < 100 ? 2 : 0)}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        up
                          ? "text-emerald-400"
                          : down
                            ? "text-red-400"
                            : "text-white/40"
                      }`}
                    >
                      {up ? "▲" : down ? "▼" : "◆"}{" "}
                      {r.changePct > 0 ? "+" : ""}
                      {r.changePct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[10px] text-white/30">
                    baseline ${fmt(r.baseline)} · {r.baselineAt.slice(0, 10)} · settle{" "}
                    {r.settleLabel}
                  </div>
                </div>
              </div>
            );
          })}
          <p className="pt-3 text-center text-[10px] text-white/25">
            Baseline snapshot: 2026-08-10 01:44 UTC (feed_oracle.py, reproducible).
            Settlement outcome is reported on-chain by the market oracle.
          </p>
        </div>
      )}
    </section>
  );
}
