"use client";

import { useState } from "react";
import { Market, MARKETS as MARKETS_ALL } from "../lib/markets";

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

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
    <div className="rounded-2xl border border-white/10 bg-lux-card p-5 shadow-lg transition hover:border-lux-gold/40">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              {m.category}
            </span>
            <span className="text-[11px] text-white/40">{m.period}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug">{m.title}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
            m.status === "open"
              ? "bg-emerald-500/15 text-emerald-400"
              : m.status === "settling"
                ? "bg-amber-500/15 text-amber-400"
                : "bg-white/10 text-white/40"
          }`}
        >
          {m.status}
        </span>
      </div>

      <p className="mb-4 text-sm text-white/60">{m.question}</p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-[11px] text-white/40">Reference index</div>
          <div className="mt-1 text-lg font-bold">
            ${fmt(m.reference)}
            <span className="ml-1 text-xs font-normal text-white/40">
              {m.referenceUnit}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-[11px] text-white/40">AI fair probability</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-emerald-400">
              UP {upPct}%
            </span>
            <span className="text-sm text-white/40">/</span>
            <span className="text-lg font-bold text-red-400">
              DOWN {downPct}%
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-lg bg-white/5 p-2.5 text-xs text-white/50">
        <span className="font-semibold text-white/70">AI: </span>
        {m.aiRationale}
      </div>

      {closed ? (
        <div className="rounded-lg bg-white/5 py-2 text-center text-sm text-white/40">
          Market closed
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-24 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-lux-gold/60"
          />
          <span className="text-xs text-white/40">OKB</span>
          <button
            onClick={() => setSide("up")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
              side === "up"
                ? "bg-emerald-500 text-black"
                : "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            Buy UP
          </button>
          <button
            onClick={() => setSide("down")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
              side === "down"
                ? "bg-red-500 text-black"
                : "border border-red-500/40 text-red-400 hover:bg-red-500/10"
            }`}
          >
            Buy DOWN
          </button>
        </div>
      )}

      {side && (
        <div className="mt-3 rounded-lg border border-lux-gold/30 bg-lux-gold/5 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">
              Staking{" "}
              <span className="font-bold text-white">
                {amount || "0"} OKB
              </span>{" "}
              on {side === "up" ? "UP" : "DOWN"}
            </span>
            <span className="text-white/60">
              Win →{" "}
              <span className="font-bold text-lux-gold">
                ~{fmt(payout(side, Number(amount) || 0))} OKB
              </span>
            </span>
          </div>
          <div className="mt-2 text-white/40">
            Settles {new Date(m.settleAt).toLocaleDateString("en-US")}. P2P
            zero-sum — winners take the losing side. USDT equivalent shown on
            settlement.
          </div>
        </div>
      )}
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
