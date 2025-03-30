"use client";

import { WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// Ensure WalletConnect Project ID is set
if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error("❌ NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is missing from .env.local");
}

// Initialize query client
const queryClient = new QueryClient();

// Define supported chains
const chains = [sepolia];

// ✅ Use getDefaultConfig directly for WagmiConfig
const wagmiConfig = getDefaultConfig({
  appName: "Land Registry",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
  autoConnect: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">  {/* ✅ Move <html> here */}
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
