export type MarketStatus = "open" | "settling" | "closed";

export interface Market {
  id: string;
  /** Asset class: classic car / luxury watch / sneaker / collectible */
  category: "Car" | "Watch" | "Goods" | "Sneaker" | "Collectible";
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
  /** Image URL (Openverse / Flickr / Wikimedia) */
  image: string;
  /** Image alt text */
  imageAlt: string;
}

export const HERO_IMAGE =
  "https://live.staticflickr.com/3779/11343004226_2ab0d1a1a4_b.jpg";

export const MARKETS: Market[] = [
  {
    id: "porsche-911-week",
    category: "Car",
    title: "Porsche 911 (991.2)",
    question:
      "Will the average Hagerty-listed price of the Porsche 911 (991.2) rise over the next 7 days?",
    upProb: 0.62,
    reference: 128450,
    referenceUnit: "USD",
    settleAt: "2026-08-16T00:00:00Z",
    status: "open",
    period: "7d · Hagerty Index",
    aiRationale:
      "Auction volume up 18% this week; summer classic-car season + positive sentiment.",
    image:
      "https://live.staticflickr.com/3779/11343004226_2ab0d1a1a4_b.jpg",
    imageAlt: "Porsche 911 sports car",
  },
  {
    id: "ferrari-roma-event",
    category: "Car",
    title: "Ferrari Roma",
    question:
      "Will Ferrari Roma (2020) auction prices exceed current index during RM Sotheby's Monterey Week?",
    upProb: 0.55,
    reference: 214900,
    referenceUnit: "USD",
    settleAt: "2026-08-22T00:00:00Z",
    status: "open",
    period: "Event · Monterey Auction Week",
    aiRationale:
      "Monterey car week historically lifts exotics 4–9%; model refreshed in 2024 keeps demand firm.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Ferrari_Roma_in_Basel.png",
    imageAlt: "Ferrari Roma in Basel",
  },
  {
    id: "rolex-sub-week",
    category: "Watch",
    title: "Rolex Submariner 126610",
    question:
      "Will the average market price of the Rolex Submariner 126610 rise over the next 7 days?",
    upProb: 0.58,
    reference: 13750,
    referenceUnit: "USD",
    settleAt: "2026-08-16T00:00:00Z",
    status: "open",
    period: "7d · WatchCharts",
    aiRationale:
      "Submariner supply tightening; secondary prices bottomed 3 weeks ago and are re-rising.",
    image:
      "https://live.staticflickr.com/8442/7892743158_0917998468_b.jpg",
    imageAlt: "Rolex diving watch",
  },
  {
    id: "birkin-25-week",
    category: "Goods",
    title: "Hermès Birkin 25 Togo",
    question:
      "Will the average resale price of the Hermès Birkin 25 (Togo, gold) rise over the next 14 days?",
    upProb: 0.47,
    reference: 24500,
    referenceUnit: "USD",
    settleAt: "2026-08-23T00:00:00Z",
    status: "open",
    period: "14d · Resale Index",
    aiRationale:
      "Hermès just raised boutique prices ~6%; resale lag typically 3–6 weeks before catching up.",
    image:
      "https://live.staticflickr.com/2713/4282506775_3505a6a68a_m.jpg",
    imageAlt: "Hermès Birkin handbag",
  },
  {
    id: "dunk-low-week",
    category: "Sneaker",
    title: "Nike Dunk Low 'Panda'",
    question:
      "Will the average StockX price of the Nike Dunk Low 'Panda' rise over the next 7 days?",
    upProb: 0.41,
    reference: 98,
    referenceUnit: "USD",
    settleAt: "2026-08-16T00:00:00Z",
    status: "open",
    period: "7d · StockX",
    aiRationale:
      "Panda restocks pressuring resale; sentiment negative, inventory overhang.",
    image:
      "https://live.staticflickr.com/3069/4556910297_2b773e7fb4_b.jpg",
    imageAlt: "Nike dunk sneakers",
  },
  {
    id: "nike-jordan-1-settling",
    category: "Sneaker",
    title: "Air Jordan 1 High 'Chicago'",
    question:
      "Will the average StockX price of the AJ1 'Chicago' 2022 rise in the 30d window?",
    upProb: 0.52,
    reference: 410,
    referenceUnit: "USD",
    settleAt: "2026-08-15T00:00:00Z",
    status: "settling",
    period: "30d window",
    aiRationale: "Settlement imminent — final index snapshot in progress.",
    image:
      "https://live.staticflickr.com/8510/8505392872_4044c2d71d_b.jpg",
    imageAlt: "Air Jordan Chicago sneaker",
  },
  {
    id: "pokemon-char-week",
    category: "Collectible",
    title: "Pokémon Charizard (151)",
    question:
      "Will the Pokémon TCG market (Nintendo NTDOY proxy) rise over the next 14 days?",
    upProb: 0.55,
    reference: 12.72,
    referenceUnit: "USD · NTDOY",
    settleAt: "2026-08-24T00:00:00Z",
    status: "open",
    period: "14d · Nintendo proxy",
    aiRationale:
      "Pokémon card demand is event-driven — new set drops and Prismatic restocks move the whole TCG market.",
    image:
      "https://live.staticflickr.com/8020/7254949880_dbce343c16_b.jpg",
    imageAlt: "Pokémon trading cards",
  },
];
