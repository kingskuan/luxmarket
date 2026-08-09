import { defineChain } from "viem";

/**
 * X Layer mainnet — chain id 196
 * Official RPC: https://xlayerrpc.okx.com
 * Explorer: https://www.okx.com/web3/explorer/xlayer
 */
export const xLayer = defineChain({
  id: 196,
  name: "X Layer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://xlayerrpc.okx.com"] },
    public: { http: ["https://xlayerrpc.okx.com"] },
  },
  blockExplorers: {
    default: {
      name: "X Layer Explorer",
      url: "https://www.okx.com/web3/explorer/xlayer",
    },
  },
});

/**
 * X Layer testnet — chain id 1952
 */
export const xLayerTest = defineChain({
  id: 1952,
  name: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testrpc.xlayer.tech/terigon"] },
    public: { http: ["https://testrpc.xlayer.tech/terigon"] },
  },
  blockExplorers: {
    default: {
      name: "X Layer Testnet Explorer",
      url: "https://www.okx.com/web3/explorer/xlayer-test",
    },
  },
});

/** Chain to use in the app (mainnet for now) */
export const ACTIVE_CHAIN = xLayer;

/** X Layer mainnet USDT (6 decimals) */
export const USDT_ADDRESS = "0x1E4a5963aBFD975d8c9021ce480b42188849D41d";

/** LuXMarket contract (deployed) */
export const LUXMARKET_ADDRESS =
  "0xd7710fb42BBad678d860bCb688E72AD5E76Cf16B";
