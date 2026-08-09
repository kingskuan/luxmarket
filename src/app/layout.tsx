import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuXMarket — AI Luxury Price Prediction on X Layer",
  description:
    "Predict price moves of classic cars, luxury watches & sneakers by staking OKB/USDT. AI seed pricing, weekly rolling markets, USDT settlement. Built on X Layer for the BuildX AI Season Hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-lux-bg text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
