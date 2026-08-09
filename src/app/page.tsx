import MarketGrid from "../components/MarketGrid";
import OkbPrice from "../components/OkbPrice";
import WalletButton from "../components/WalletButton";
import MarketPulse from "../components/MarketPulse";
import { HERO_IMAGE } from "../lib/markets";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050506] text-[#fafafa] antialiased">
      {/* ambient glows */}
      <div className="pointer-events-none fixed -right-24 -top-40 z-0 h-[500px] w-[500px] rounded-full bg-lux-gold/10 blur-[120px]" />
      <div className="pointer-events-none fixed -left-32 bottom-[10%] z-0 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[120px]" />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="text-xl font-bold tracking-tight">
          LuX<span className="text-lux-gold">Market</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#markets" className="hidden text-sm text-white/60 transition hover:text-lux-gold sm:block">
            Markets
          </a>
          <a href="#how" className="hidden text-sm text-white/60 transition hover:text-lux-gold sm:block">
            How it works
          </a>
          <OkbPrice />
          <WalletButton />
        </div>
      </nav>

      {/* hero — full-bleed image */}
      <section className="relative z-[1] flex min-h-[78vh] flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-black/60 to-black/30" />
        <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="mb-6 text-xs uppercase tracking-[0.5em] text-lux-gold">
            BuildX AI Season · X Layer
          </div>
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-3px] sm:text-7xl lg:text-8xl">
            OWN THE
            <br />
            <span className="text-lux-gold">PREDICTION.</span>
            <br />
            <span className="font-light text-white/25">NOT THE WATCH.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base font-light leading-relaxed text-white/55">
            AI prices the impossible — a Rolex, a 911, a grail sneaker. You
            stake OKB on the direction. Winners take the pool, settled in
            USDT. The luxury market, open to everyone.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#markets"
              className="bg-lux-gold px-8 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)]"
            >
              Start Predicting →
            </a>
            <a
              href="#how"
              className="border border-white/25 px-7 py-4 text-sm text-white transition hover:border-lux-gold hover:text-lux-gold"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ticker marquee */}
      <div className="relative z-[1] overflow-hidden border-y border-white/10 py-4">
        <div className="flex w-max animate-[scroll_28s_linear_infinite] gap-12 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-12">
              <TickerItem t="ROLEX SUBMARINER" p="UP 58%" />
              <TickerItem t="PORSCHE 991.2" p="UP 62%" />
              <TickerItem t="BIRKIN 25" p="UP 47%" />
              <TickerItem t="FERRARI ROMA" p="UP 55%" />
              <TickerItem t="DUNK PANDA" p="UP 41%" />
              <TickerItem t="AJ1 CHICAGO" p="SETTLING" />
            </div>
          ))}
        </div>
      </div>

      {/* markets */}
      <section id="markets" className="relative z-[1] mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="mb-8 text-xs uppercase tracking-[0.4em] text-white/40">
          Live Markets
        </h2>
        <MarketGrid />
      </section>

      {/* AI market pulse — luxury news feed */}
      <MarketPulse />

      {/* how it works */}
      <section id="how" className="relative z-[1] mx-auto max-w-4xl px-6 py-24 text-center sm:px-10">
        <h2 className="text-4xl font-medium leading-tight tracking-[-2px] sm:text-5xl">
          Luxury markets are <span className="text-lux-gold">opaque.</span>
          <br />
          We make them <span className="text-lux-gold">predictable.</span>
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {[
            { n: "01", t: "AI seeds the price", d: "Index data + auction news + sentiment → fair probability per market. Neutral anchor, never a counterparty." },
            { n: "02", t: "You take a side", d: "Stake OKB on UP or DOWN. As little as $1 equivalent. Shares tradable before settlement." },
            { n: "03", t: "Settle & win", d: "Real index snapshot decides. Winners split the losing pool. USDT settlement on X Layer." },
          ].map((s) => (
            <div key={s.n}>
              <div className="font-mono text-sm font-semibold text-lux-gold">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/50">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-[1] border-t border-white/5 py-10 text-center text-xs text-white/30">
        LuXMarket · Building for{" "}
        <a href="https://x.com/XLayerOfficial" className="text-lux-gold">
          @XLayerOfficial BuildX AI Season
        </a>{" "}
        · demo data — settlement oracles &amp; smart contracts in progress
      </footer>
    </main>
  );
}

function TickerItem({ t, p }: { t: string; p: string }) {
  return (
    <span className="font-mono text-[13px] text-white/45">
      <b className="font-medium text-lux-gold">{t}</b> {p}
    </span>
  );
}
