"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PulseItem {
  title: string;
  source: string;
  date: string;
  market?: string;
  asset: string;
  direction: "bullish" | "bearish" | "neutral";
  reason: string;
}

interface PulseResp {
  ok: boolean;
  items?: PulseItem[];
  theme?: string;
  fetchedAt?: string;
  error?: string;
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

const REFRESH_MS = 45_000;

export default function MarketPulse() {
  const [items, setItems] = useState<PulseItem[] | null>(null);
  const [theme, setTheme] = useState<string>("");
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const prevKeys = useRef<Set<string>>(new Set());

  const fetchPulse = useCallback(async () => {
    try {
      // 随机主题由服务端挑选; 时间戳防缓存
      const r = await fetch(`/api/pulse?t=${Date.now()}`, { cache: "no-store" });
      const d: PulseResp = await r.json();
      if (d.ok && d.items) {
        const keys = new Set(d.items.map((i) => i.title.toLowerCase().replace(/[^a-z0-9]/g, "")));
        // 标出本次轮询新出现的条目
        const fresh = new Set<string>();
        for (const k of keys) if (!prevKeys.current.has(k)) fresh.add(k);
        prevKeys.current = keys;
        setNewKeys(fresh);
        setItems(d.items);
        setTheme(d.theme || "");
        setFetchedAt(d.fetchedAt ? new Date(d.fetchedAt) : new Date());
      } else {
        setError(d.error || "unknown");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchPulse();
    const id = setInterval(fetchPulse, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchPulse]);

  // stagger-reveal pulse cards once feed loads / refreshes
  useEffect(() => {
    const list = listRef.current;
    if (!list || !items || items.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        list.querySelectorAll(":scope > div"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: list, start: "top 92%", once: true },
        }
      );
    }, list);
    return () => ctx.revert();
  }, [items]);

  const tickerItems = items ? items.slice(0, 3) : [];
  // 双份内容实现无缝循环
  const tickerContent = [...tickerItems, ...tickerItems];

  return (
    <section className="relative z-[1] mx-auto max-w-6xl px-6 pb-20 sm:px-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xs uppercase tracking-[0.4em] text-white/40">
            AI Market Pulse
          </h2>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            LIVE · auto-refresh 45s
          </span>
        </div>
        <span className="text-[10px] text-white/30">
          {fetchedAt
            ? `updated ${fetchedAt.toLocaleTimeString("en-US", { hour12: false })}`
            : "loading…"}
        </span>
      </div>

      {/* 跑马灯: 最新 3 条无限循环 */}
      {tickerItems.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
          <div
            className="flex w-max items-center gap-8 py-2.5 pr-8"
            style={{
              animation: "scroll 35s linear infinite",
              minWidth: "200%",
            }}
          >
            {tickerContent.map((it, i) => {
              const st = DIR_STYLE[it.direction];
              return (
                <span
                  key={`${i}-${it.title}`}
                  className="flex shrink-0 items-center gap-2 text-[11px] text-white/55"
                >
                  <span className={`font-bold ${st.text}`}>{st.arrow}</span>
                  <span className="font-semibold text-lux-gold/80">{it.asset}</span>
                  <span className="max-w-[280px] truncate">{it.title}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {theme && (
        <div className="mb-4 flex items-center gap-2 text-[10px] text-white/30">
          <span className="rounded border border-white/10 px-1.5 py-0.5">
            topic: {theme.slice(0, 80)}
            {theme.length > 80 ? "…" : ""}
          </span>
        </div>
      )}

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
        <div ref={listRef} className="grid gap-3 md:grid-cols-2">
          {items.slice(0, 8).map((it) => {
            const st = DIR_STYLE[it.direction];
            const key = it.title.toLowerCase().replace(/[^a-z0-9]/g, "");
            const isNew = newKeys.has(key);
            return (
              <div
                key={key}
                className={`relative flex items-start gap-3 rounded-xl border bg-white/[0.03] p-4 transition hover:border-lux-gold/30 ${
                  isNew
                    ? "border-lux-gold/40 shadow-[0_0_24px_rgba(212,175,55,0.08)]"
                    : "border-white/8"
                }`}
              >
                {isNew && (
                  <span className="absolute -top-2 right-3 rounded-full border border-lux-gold/40 bg-[#0a0a0c] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lux-gold">
                    new
                  </span>
                )}
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
