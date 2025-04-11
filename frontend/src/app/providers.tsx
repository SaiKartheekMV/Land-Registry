"use client";

import { WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";

import "@rainbow-me/rainbowkit/styles.css";

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID in .env.local");
}

const wagmiConfig = getDefaultConfig({
  appName: "Land Registry",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia],
  autoConnect: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[sepolia]}>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
