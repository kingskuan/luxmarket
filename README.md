# LuXMarket ⚜️

**AI-powered luxury price prediction market on X Layer.**

Predict price moves of **classic cars, luxury watches & sneakers** by staking **OKB** (or USDT) on weekly rolling & event-driven markets. AI seeds every market with a fair probability; P2P zero-sum settlement means winners take the losing side. Built for the **BuildX AI Season Hackathon** by X Layer.

![X Layer](https://img.shields.io/badge/X%20Layer-196-000000)
![BuildX](https://img.shields.io/badge/BuildX%20AI%20Season-2026-d4af37)

---

## Why

Luxury assets are the most relatable real-world assets (RWA) — a Rolex, a Porsche 911, a grail sneaker — yet their price discovery is fragmented across private indices, auction houses and resale platforms. LuXMarket turns luxury-market intelligence into an **open, AI-accessible prediction layer onchain**.

## How it works

1. **AI sets the fair price** — an engine ingests index data (Hagerty, WatchCharts, StockX) + auction/launch news and seeds each market with a fair probability (e.g. "Porsche 991.2 UP 62%").
2. **You stake OKB on UP or DOWN** — markets are weekly rolling or event-driven (auction weeks, model launches). Min stake 1 OKB; USDT settlement, so the playable unit is small.
3. **Winners take the pool** — at settlement, the real index snapshot decides. Fully collateralized, P2P zero-sum. Shares are tradable before settlement.

## Design decisions

| Decision | Why |
|---|---|
| **P2P zero-sum, not AMM** | Zero protocol exposure; liquidity comes from participants, no treasury risk |
| **USDT-denominated settlement, OKB as rail** | OKB at ~$94/unit is a high-denomination stake; USDT keeps the entry barrier at $1 while OKB remains the onramp & staking asset — deep X Layer ecosystem integration |
| **Weekly rolling + event markets** | Monthly settlement kills engagement; weekly + auction/launch events keep constant activity |
| **AI seed pricing + neutral anchor** | AI is a price oracle, not a counterparty — no capital needed to make markets |
| **Shared liquidity pool (conditional-token style)** | Capital efficiency across all markets (planned v2) |

## Track & prizes targeted

- **Liquidity Grant** — AI-RWA track: luxury assets are a textbook RWA, AI is the core engine
- **Hackathon Grant** — innovation, product completeness, X Layer integration

## Roadmap

- [x] MVP frontend (this demo): live market cards, AI probability anchors, OKB stake UX
- [ ] X Layer testnet: conditional-token shared pool + LMSR-style small pool
- [ ] Settlement oracle (multi-sig from Chrono24/WatchCharts/Hagerty/StockX + dispute window)
- [ ] OKX DEX widget for OKB onramp (Launch Grant volume attribution)
- [ ] Live index ingestion + AI re-pricing every 15 min

## Stack

- **Next.js 15** + React 19 + Tailwind CSS
- Deploys on **Railway** (Nixpacks)
- Target chain: **X Layer** (chain id 196, zero-fee, OKB gas)

## Run locally

```bash
npm ci
npm run dev
# open http://localhost:3000
```

---

*Demo data shown for hackathon submission. Settlement oracles and smart contracts on X Layer are in progress. Not investment advice.*
