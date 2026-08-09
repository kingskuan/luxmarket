"use client";

import { useWeb3 } from "./Web3Provider";

export default function WalletButton() {
  const { address, connect, disconnect } = useWeb3();

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-300">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="cursor-pointer border border-white/20 px-3 py-1.5 text-xs text-white/60 transition hover:border-red-400 hover:text-red-400"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="cursor-pointer border border-lux-gold/50 px-5 py-2 text-sm font-medium text-lux-gold transition hover:bg-lux-gold hover:text-black"
    >
      Connect Wallet
    </button>
  );
}
