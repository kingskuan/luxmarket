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

/** X Layer USD₮0 (native stablecoin users actually hold, 6 decimals) */
export const USDT_ADDRESS = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736";

/** LuXMarket contract (v2, deployed on X Layer mainnet, USD₮0 collateral) */
export const LUXMARKET_ADDRESS =
  "0xFb7154E06B068031502051D285dE910b16A5aF0D";

/** Map frontend market id -> on-chain market id (bytes32, keccak256 of id) */
export const MARKET_IDS: Record<string, `0x${string}`> = {
  "porsche-911-week": "0x10e55ad5ef2fd3e437ecddb4c23e878382e192e7f5bd620e2fd0c8dc43509a97",
  "ferrari-roma-event": "0x955b74aae0f08eb01134a7c8ff32d7203b172a3f96ccce86711597a3718db7f1",
  "rolex-sub-week": "0x770aa63d053ce0424f9f5aa7b8d259e3afc249b32cac607bec7d1d6178f4031b",
  "birkin-25-week": "0xcdbff3ee2a706880bf78afcbe3f50717d50a8ee47b1d9079ed8bb4a8c5930d1a",
  "dunk-low-week": "0x8410dbce3b086a86871cd0c32fbe0d0527076bc2be8569f27f063355702f51e1",
  "nike-jordan-1-settling": "0x71429fd2e5cbad363e7c6026ae402bcba0e996a0abaec639b5c0cf5b0c94d52d",
};
