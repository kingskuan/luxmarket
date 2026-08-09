import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Web3Provider from "../components/Web3Provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="bg-[#050506] text-[#fafafa] antialiased min-h-screen">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
