"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { xLayer } from "../lib/chain";

interface Web3State {
  address: `0x${string}` | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  walletClient: ReturnType<typeof createWalletClient> | null;
  publicClient: ReturnType<typeof createPublicClient> | null;
}

const Web3Context = createContext<Web3State>({
  address: null,
  connect: async () => {},
  disconnect: () => {},
  walletClient: null,
  publicClient: null,
});

export function useWeb3() {
  return useContext(Web3Context);
}

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [walletClient, setWalletClient] = useState<
    ReturnType<typeof createWalletClient> | null
  >(null);

  const publicClient = useMemo(
    () => createPublicClient({ chain: xLayer, transport: http() }),
    []
  );

  useEffect(() => {
    // restore session if wallet previously connected
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accs: unknown) => {
          const accounts = accs as string[];
          if (accounts.length > 0) {
            setAddress(accounts[0] as `0x${string}`);
            setWalletClient(
              createWalletClient({
                chain: xLayer,
                transport: custom(window.ethereum!),
              })
            );
          }
        })
        .catch(() => {});
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert(
        "No wallet detected. Please install OKX Wallet or MetaMask, or use the OKX Web3 extension."
      );
      return;
    }
    try {
      const client = createWalletClient({
        chain: xLayer,
        transport: custom(window.ethereum),
      });
      const [addr] = await client.requestAddresses();
      setAddress(addr);
      setWalletClient(client);
    } catch (e) {
      console.error("connect failed", e);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletClient(null);
  }, []);

  return (
    <Web3Context.Provider
      value={{ address, connect, disconnect, walletClient, publicClient }}
    >
      {children}
    </Web3Context.Provider>
  );
}
