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

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const CAT_STYLE: Record<string, string> = {
  Car: "text-lux-gold",
  Watch: "text-emerald-400",
  Goods: "text-purple-400",
  Sneaker: "text-amber-400",
};

const USDT_ABI = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
]);

function MarketCard({ m }: { m: Market }) {
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

  const marketId = MARKET_IDS[m.id];

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

  const upPct = chainPrice !== null ? Math.round(chainPrice * 100) : Math.round(m.upProb * 100);
  const downPct = 100 - upPct;
  const payout = (s: "up" | "down", amt: number) => {
    const p = s === "up" ? upPct / 100 : downPct / 100;
    if (p <= 0) return 0;
    return amt / p;
  };

  const closed = m.status === "closed";

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
      // 1) approve USDT
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
    <div ref={gridRef} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {MARKETS_ALL.map((m) => (
        <MarketCard key={m.id} m={m} />
      ))}
    </div>
  );
}
