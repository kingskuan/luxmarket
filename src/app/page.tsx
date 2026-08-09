import MarketGrid from "../components/MarketGrid";
import OkbPrice from "../components/OkbPrice";
import WalletButton from "../components/WalletButton";
import MarketPulse from "../components/MarketPulse";
import MarketShare from "../components/MarketShare";
import LiveTicker from "../components/LiveTicker";
import Reveal from "../components/Reveal";
import HeroFX from "../components/HeroFX";
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
        <HeroFX backgroundImage={HERO_IMAGE} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-black/60 to-black/30" />
        <Reveal
          trigger={false}
          stagger={0.14}
          y={50}
          duration={1.1}
          className="relative mx-auto w-full max-w-6xl px-6 sm:px-10"
        >
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
            AI reads live prices — a Rolex, a 911, a grail sneaker. You stake
            USD₮0 on the direction. Winners take the pool, settled on-chain.
            The luxury market, open to everyone.
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
        </Reveal>
      </section>

      {/* ticker marquee — live oracle data */}
      <LiveTicker />

      {/* market share — sizing animation */}
      <MarketShare />

      {/* markets */}
      <section id="markets" className="relative z-[1] mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <Reveal>
          <h2 className="mb-8 text-xs uppercase tracking-[0.4em] text-white/40">
            Live Markets
          </h2>
        </Reveal>
        <MarketGrid />
      </section>

      {/* AI market pulse — luxury news feed */}
      <MarketPulse />

      {/* how it works */}
      <section id="how" className="relative z-[1] mx-auto max-w-4xl px-6 py-24 text-center sm:px-10">
        <Reveal>
          <h2 className="text-4xl font-medium leading-tight tracking-[-2px] sm:text-5xl">
            Luxury markets are <span className="text-lux-gold">opaque.</span>
            <br />
            We make them <span className="text-lux-gold">predictable.</span>
          </h2>
        </Reveal>
        <Reveal stagger={0.15} className="mt-14 grid gap-10 sm:grid-cols-3">
          {[
            { n: "01", t: "AI reads live prices", d: "Real data feeds — Yahoo Finance, Bob's Watches listings, Google News — anchor each market. Verifiable sources, refreshed every minute." },
            { n: "02", t: "You take a side", d: "Stake USD₮0 on UP or DOWN. Shares priced by the on-chain LMSR market. Sell before settlement anytime." },
            { n: "03", t: "Settle & win", d: "The on-chain oracle reports the real outcome after the dispute window. Winners split the losing pool, paid in USD₮0." },
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
        </Reveal>
      </section>

      <footer className="relative z-[1] border-t border-white/5 py-10 text-center text-xs text-white/30">
        LuXMarket · Building for{" "}
        <a href="https://x.com/XLayerOfficial" className="text-lux-gold">
          @XLayerOfficial BuildX AI Season
        </a>{" "}
        · live on-chain · X Layer mainnet
      </footer>
    </main>
  );
}
