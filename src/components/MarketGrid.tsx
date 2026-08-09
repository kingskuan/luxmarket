"use client";

import { useState } from "react";
import Image from "next/image";
import { Market, MARKETS as MARKETS_ALL } from "../lib/markets";

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const CAT_STYLE: Record<string, string> = {
  Car: "text-lux-gold",
  Watch: "text-emerald-400",
  Goods: "text-purple-400",
  Sneaker: "text-amber-400",
};

function MarketCard({ m }: { m: Market }) {
  const [side, setSide] = useState<"up" | "down" | null>(null);
  const [amount, setAmount] = useState("10");

  const upPct = Math.round(m.upProb * 100);
  const downPct = 100 - upPct;
  const payout = (s: "up" | "down", amt: number) => {
    const p = s === "up" ? m.upProb : 1 - m.upProb;
    if (p <= 0) return 0;
    return amt / p;
  };

  const closed = m.status === "closed";

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
              m.status === "open"
                ? "bg-emerald-500/25 text-emerald-300"
                : m.status === "settling"
                  ? "bg-amber-500/25 text-amber-300"
                  : "bg-white/20 text-white/70"
            }`}
          >
            {m.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <div className={`text-[10px] uppercase tracking-[0.3em] ${CAT_STYLE[m.category]}`}>
            {m.period}
          </div>
          <h3 className="mt-1 text-xl font-bold leading-tight">{m.title}</h3>
          <div className="mt-1 font-mono text-2xl font-medium">
            ${fmt(m.reference)}
            <span className="ml-1 text-xs font-normal text-white/40">
              {m.referenceUnit}
            </span>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between text-xs">
          <span className="text-emerald-400">UP {upPct}%</span>
          <span className="text-red-400">DOWN {downPct}%</span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded bg-white/10">
          <div
            className="h-full rounded bg-gradient-to-r from-emerald-400 to-lux-gold"
            style={{ width: `${upPct}%` }}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-white/45">
          <span className="font-semibold text-white/70">AI: </span>
          {m.aiRationale}
        </p>

        {closed ? (
          <div className="mt-4 rounded-lg bg-white/5 py-2 text-center text-sm text-white/40">
            Market closed
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
              <span className="text-xs text-white/40">OKB</span>
              <div className="flex flex-1 gap-2">
                <button
                  onClick={() => setSide("up")}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                    side === "up"
                      ? "bg-emerald-500 text-black"
                      : "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  BUY UP
                </button>
                <button
                  onClick={() => setSide("down")}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                    side === "down"
                      ? "bg-red-500 text-black"
                      : "border border-red-500/40 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  BUY DOWN
                </button>
              </div>
            </div>

            {side && (
              <div className="rounded-lg border border-lux-gold/30 bg-lux-gold/5 p-2.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/60">
                    {amount || "0"} OKB on{" "}
                    <span className="font-bold text-white">
                      {side === "up" ? "UP" : "DOWN"}
                    </span>
                  </span>
                  <span className="text-white/60">
                    Win →{" "}
                    <span className="font-bold text-lux-gold">
                      ~{fmt(payout(side, Number(amount) || 0))} OKB
                    </span>
                  </span>
                </div>
                <div className="mt-1 text-white/40">
                  Settles {new Date(m.settleAt).toLocaleDateString("en-US")}.
                  P2P zero-sum.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {MARKETS_ALL.map((m) => (
        <MarketCard key={m.id} m={m} />
      ))}
    </div>
  );
}
