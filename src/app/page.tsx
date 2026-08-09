import MarketGrid from "../components/MarketGrid";
import OkbPrice from "../components/OkbPrice";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      {/* Hero */}
      <header className="border-b border-white/10 py-14 text-center">
        <div className="mb-4 flex justify-center">
          <OkbPrice />
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          LuX<span className="text-lux-gold">Market</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
          The first AI-powered luxury price prediction market on{" "}
          <span className="font-semibold text-white">X Layer</span>.
          <br />
          Predict price moves of classic cars, luxury watches &amp; sneakers by
          staking OKB — settle in USDT, play from $1.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-white/50">
          <span className="rounded-full border border-white/15 px-3 py-1">
            🤖 AI seed pricing
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1">
            🏁 Weekly rolling + event markets
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1">
            ⚖️ P2P zero-sum, fully collateralized
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1">
            🔗 Built for BuildX AI Season Hackathon
          </span>
        </div>
      </header>

      {/* Markets */}
      <section className="py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Live Markets <span className="text-white/30">· X Layer</span>
          </h2>
          <span className="text-xs text-white/40">
            AI probability anchor updates every 15 min
          </span>
        </div>
        <MarketGrid />
      </section>

      {/* How it works */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-lux-card p-8">
        <h2 className="mb-6 text-xl font-bold">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "1 · AI sets the fair price",
              d: "Our engine ingests index data (Hagerty, WatchCharts, StockX) + auction news to seed every market with a fair probability.",
            },
            {
              t: "2 · You stake OKB on UP or DOWN",
              d: "Deposit OKB (or USDT) on a market. As low as 1 OKB. Markets are weekly rolling or event-driven (auction weeks, launches).",
            },
            {
              t: "3 · Winners take the pool",
              d: "At settlement the real index snapshot decides. P2P zero-sum: winners split the losing side. Shares tradable before settlement.",
            },
          ].map((s) => (
            <div key={s.t}>
              <div className="mb-2 font-bold text-lux-gold">{s.t}</div>
              <div className="text-sm leading-relaxed text-white/60">
                {s.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-white/30">
        LuXMarket · Building for{" "}
        <span className="text-white/50">@XLayerOfficial BuildX AI Season</span>{" "}
        · Demo data for hackathon submission — settlement oracles &amp; smart
        contracts on X Layer testnet/mainnet in progress.
      </footer>
    </main>
  );
}
