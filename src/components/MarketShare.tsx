"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Estimated luxury resale market split — demo figures for animation showcase */
const SEGMENTS = [
  { name: "Handbags & Goods", pct: 40, value: 21, color: "#d4af37" },
  { name: "Luxury Watches", pct: 27, value: 14, color: "#6c8cff" },
  { name: "Sneakers", pct: 17, value: 9, color: "#f59e0b" },
  { name: "Classic Cars", pct: 16, value: 8, color: "#a78bfa" },
];
const TOTAL_BILLIONS = 52;
const GROWTH_YOY = 12.4;

function countUp(el: Element, to: number, opts: { duration?: number; delay?: number; decimals?: number; prefix?: string; suffix?: string } = {}) {
  const { duration = 1.6, delay = 0, decimals = 0, prefix = "", suffix = "" } = opts;
  const proxy = { val: 0 };
  gsap.to(proxy, {
    val: to,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = prefix + proxy.val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix;
    },
  });
}

export default function MarketShare() {
  const rootRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const growthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = { trigger: root, start: "top 75%", once: true } as const;

    const ctx = gsap.context(() => {
      // 1) total market cap count-up + growth
      if (totalRef.current) countUp(totalRef.current, TOTAL_BILLIONS, { suffix: "B" });
      if (growthRef.current) countUp(growthRef.current, GROWTH_YOY, { decimals: 1, prefix: "+", suffix: "%", delay: 0.3 });

      // 2) donut arcs draw themselves in sequence
      const circles = Array.from(root.querySelectorAll<SVGCircleElement>(".donut-seg"));
      circles.forEach((c, i) => {
        const pct = Number(c.dataset.pct);
        gsap.fromTo(
          c,
          { strokeDasharray: "0 100" },
          {
            strokeDasharray: `${pct} ${100 - pct}`,
            duration: 1.3,
            delay: 0.2 + i * 0.18,
            ease: "power2.inOut",
            scrollTrigger: trigger,
          }
        );
      });

      // 3) segment bars grow + per-segment $ values count up
      const bars = Array.from(root.querySelectorAll<HTMLElement>(".seg-bar"));
      bars.forEach((bar, i) => {
        const pct = Number(bar.dataset.pct);
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${pct}%`,
            duration: 1.2,
            delay: 0.3 + i * 0.15,
            ease: "power3.out",
            scrollTrigger: trigger,
          }
        );
      });
      const segVals = Array.from(root.querySelectorAll<HTMLElement>(".seg-val"));
      segVals.forEach((v, i) => {
        countUp(v, Number(v.dataset.value), { suffix: "B", delay: 0.35 + i * 0.15 });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  let cum = 0;
  const arcs = SEGMENTS.map((s) => {
    const off = cum;
    cum += s.pct;
    return { ...s, offset: off };
  });

  return (
    <section ref={rootRef} id="share" className="relative z-[1] mx-auto max-w-6xl px-6 py-24 sm:px-10">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-white/40">
          The Market We Price
        </div>
        <h2 className="mt-3 text-4xl font-medium leading-tight tracking-[-2px] sm:text-5xl">
          Luxury resale is a <span className="text-lux-gold">$52B</span> market.
        </h2>
      </div>

      <div className="flex flex-col items-center gap-14 lg:flex-row lg:gap-20">
        {/* donut + center total */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 42 42" className="h-64 w-64 -rotate-90 sm:h-72 sm:w-72">
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="#1c2230" strokeWidth="3.2" />
            {arcs.map((s) => (
              <circle
                key={s.name}
                className="donut-seg"
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke={s.color}
                strokeWidth="3.2"
                strokeDasharray={`${s.pct} ${100 - s.pct}`}
                strokeDashoffset={-s.offset}
                data-pct={s.pct}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Total resale
            </span>
            <div
              ref={totalRef}
              className="num mt-1 font-mono text-4xl font-semibold text-lux-gold sm:text-5xl"
            >
              $0B
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="font-mono">▲</span>
              <span ref={growthRef} className="num font-mono">+0.0%</span>
              <span className="text-white/40">YoY</span>
            </div>
          </div>
        </div>

        {/* segment list */}
        <div className="w-full max-w-md space-y-6">
          {arcs.map((s) => (
            <div key={s.name}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: s.color }}
                  />
                  {s.name}
                </span>
                <span className="font-mono text-sm text-white/70">
                  <span className="num seg-val">$0B</span>
                  <span className="ml-2 text-lux-gold num" data-pct-label>
                    {s.pct}%
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="seg-bar h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }}
                  data-pct={s.pct}
                  data-value={s.value}
                />
              </div>
            </div>
          ))}
          <p className="pt-2 text-[11px] leading-relaxed text-white/30">
            * Illustrative estimates for demo — settlement oracles derive live
            probability per market, not market sizing.
          </p>
        </div>
      </div>
    </section>
  );
}
