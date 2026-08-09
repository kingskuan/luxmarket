export type MarketStatus = "open" | "settling" | "closed";

export interface Market {
  id: string;
  /** Asset class: classic car / luxury watch / sneaker */
  category: "Car" | "Watch" | "Sneaker";
  /** Short human label */
  title: string;
  /** Longer description of the prediction question */
  question: string;
  /** AI-modeled probability (0..1) of the price going UP by settlement */
  upProb: number;
  /** Reference index level (e.g. Hagerty index points, StockX avg price) */
  reference: number;
  /** Reference unit, e.g. USD */
  referenceUnit: string;
  /** Settlement date ISO */
  settleAt: string;
  /** Market status */
  status: MarketStatus;
  /** Weekly rolling label */
  period: string;
  /** Reason taglines the AI engine outputs */
  aiRationale: string;
}

export const MARKETS: Market[] = [
  {
    id: "porsche-911-week",
    category: "Car",
    title: "Porsche 911 (991.2) — 7d",
    question:
      "Will the average Hagerty-listed price of the Porsche 911 (991.2) rise over the next 7 days?",
    upProb: 0.62,
    reference: 128450,
    referenceUnit: "USD",
    settleAt: "2026-08-16T00:00:00Z",
    status: "open",
    period: "Weekly rolling",
    aiRationale:
      "Auction volume up 18% this week; summer classic-car season + positive sentiment.",
  },
  {
    id: "ferrari-roma-event",
    category: "Car",
    title: "Ferrari Roma — Auction Week",
    question:
      "Will Ferrari Roma (2020) auction prices exceed current index during RM Sotheby's Monterey Week?",
    upProb: 0.55,
    reference: 214900,
    referenceUnit: "USD",
    settleAt: "2026-08-22T00:00:00Z",
    status: "open",
    period: "Event: Monterey Auction Week",
    aiRationale:
      "Monterey car week historically lifts exotics 4–9%; model refreshed in 2024 keeps demand firm.",
  },
  {
    id: "rolex-sub-week",
    category: "Watch",
    title: "Rolex Submariner 126610 — 7d",
    question:
      "Will the average market price of the Rolex Submariner 126610 rise over the next 7 days?",
    upProb: 0.58,
    reference: 13750,
    referenceUnit: "USD",
    settleAt: "2026-08-16T00:00:00Z",
    status: "open",
    period: "Weekly rolling",
    aiRationale:
      "Submariner supply tightening; secondary prices bottomed 3 weeks ago and are re-rising.",
  },
  {
    id: "birkin-25-week",
    category: "Watch",
    title: "Hermès Birkin 25 Togo — 14d",
    question:
      "Will the average resale price of the Hermès Birkin 25 (Togo, gold) rise over the next 14 days?",
    upProb: 0.47,
    reference: 24500,
    referenceUnit: "USD",
    settleAt: "2026-08-23T00:00:00Z",
    status: "open",
    period: "14-day rolling",
    aiRationale:
      "Hermès just raised boutique prices ~6%; resale lag typically 3–6 weeks before catching up.",
  },
  {
    id: "dunk-low-week",
    category: "Sneaker",
    title: "Nike Dunk Low 'Panda' — 7d",
    question:
      "Will the average StockX price of the Nike Dunk Low 'Panda' rise over the next 7 days?",
    upProb: 0.41,
    reference: 98,
    referenceUnit: "USD",
    settleAt: "2026-08-16T00:00:00Z",
    status: "open",
    period: "Weekly rolling",
    aiRationale:
      "Panda restocks pressuring resale; sentiment negative, inventory overhang.",
  },
  {
    id: "nike-jordan-1-settling",
    category: "Sneaker",
    title: "Air Jordan 1 High 'Chicago' — Settling",
    question:
      "Will the average StockX price of the AJ1 'Chicago' 2022 rise in the 30d window?",
    upProb: 0.52,
    reference: 410,
    referenceUnit: "USD",
    settleAt: "2026-08-15T00:00:00Z",
    status: "settling",
    period: "30-day window",
    aiRationale: "Settlement imminent — final index snapshot in progress.",
  },
];
