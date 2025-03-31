"use client";

import { WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";


if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is missing from .env.local");
}


const queryClient = new QueryClient();


const chains = [sepolia];


const wagmiConfig = getDefaultConfig({
  appName: "Land Registry",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
  autoConnect: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> 
      <body>
        <WagmiConfig config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}