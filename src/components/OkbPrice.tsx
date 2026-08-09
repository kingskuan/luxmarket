"use client";

import { useEffect, useState } from "react";

export default function OkbPrice() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=okb&vs_currencies=usd"
    )
      .then((r) => r.json())
      .then((d) => setPrice(d?.okb?.usd ?? null))
      .catch(() => setPrice(null));
  }, []);

  if (price === null) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-lux-gold/40 bg-lux-gold/10 px-3 py-1 text-sm font-medium text-lux-gold">
      OKB ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
    </span>
  );
}
