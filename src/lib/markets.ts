export type MarketStatus = "open" | "settling" | "closed";

export interface Market {
  id: string;
  /** Asset class */
  category: "Car" | "Watch" | "Goods" | "Sneaker" | "Collectible";
  /** Short human label */
  title: string;
  /** Longer description of the prediction question */
  question: string;
  /** Image URL (Openverse / Flickr / Wikimedia) */
  image: string;
  /** Image alt text */
  imageAlt: string;
}

export const HERO_IMAGE =
  "https://live.staticflickr.com/3779/11343004226_2ab0d1a1a4_b.jpg";

/**
 * 元数据只含静态展示信息 (标题/分类/图片/问题)。
 * ⚠️ 所有数值 (价格/概率/结算时间/状态) 一律来自链上 + 真实数据源,
 *    见 /api/markets — 硬条件: 页面不出现任何硬编码行情数据。
 */
export const MARKETS: Market[] = [
  {
    id: "porsche-911-week",
    category: "Car",
    title: "Porsche 911 (991.2)",
    question:
      "Will the Porsche brand proxy (P911.DE share price) rise by settlement?",
    image:
      "https://live.staticflickr.com/3779/11343004226_2ab0d1a1a4_b.jpg",
    imageAlt: "Porsche 911 sports car",
  },
  {
    id: "ferrari-roma-event",
    category: "Car",
    title: "Ferrari Roma",
    question:
      "Will the Ferrari brand proxy (RACE share price) rise during Monterey Week?",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Ferrari_Roma_in_Basel.png",
    imageAlt: "Ferrari Roma in Basel",
  },
  {
    id: "rolex-sub-week",
    category: "Watch",
    title: "Rolex Submariner 126610",
    question:
      "Will the median Bob's Watches listing price of Submariner models rise over the next 7 days?",
    image:
      "https://live.staticflickr.com/8442/7892743158_0917998468_b.jpg",
    imageAlt: "Rolex diving watch",
  },
  {
    id: "birkin-25-week",
    category: "Goods",
    title: "Hermès Birkin 25 Togo",
    question:
      "Will the Hermès brand proxy (RMS.PA share price) rise over the next 14 days?",
    image:
      "https://live.staticflickr.com/2713/4282506775_3505a6a68a_m.jpg",
    imageAlt: "Hermès Birkin handbag",
  },
  {
    id: "dunk-low-week",
    category: "Sneaker",
    title: "Nike Dunk Low 'Panda'",
    question:
      "Will the Nike brand proxy (NKE share price) rise over the next 7 days?",
    image:
      "https://live.staticflickr.com/3069/4556910297_2b773e7fb4_b.jpg",
    imageAlt: "Nike dunk sneakers",
  },
  {
    id: "nike-jordan-1-settling",
    category: "Sneaker",
    title: "Air Jordan 1 High 'Chicago'",
    question:
      "Will the Nike brand proxy (NKE share price) rise in the 30d window?",
    image:
      "https://live.staticflickr.com/8510/8505392872_4044c2d71d_b.jpg",
    imageAlt: "Air Jordan Chicago sneaker",
  },
  {
    id: "pokemon-char-week",
    category: "Collectible",
    title: "Pokémon Charizard (151)",
    question:
      "Will the Pokémon ecosystem proxy (NTDOY share price) rise over the next 14 days?",
    image:
      "https://live.staticflickr.com/8020/7254949880_dbce343c16_b.jpg",
    imageAlt: "Pokémon trading cards",
  },
];
