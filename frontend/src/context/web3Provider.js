"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { defineConfig } from 'wagmi';
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    connectors: [injected()],
    transports: {
      [sepolia.id]: { http: () => "https://gas.api.infura.io/v3/7ef850b852124b308ace4d7c27c4de72" }, // Replace with your Alchemy API key
    },
    autoConnect: true,
  })
);

export default function Web3Provider({ children }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
