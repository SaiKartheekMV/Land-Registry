"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-green-800 text-white">
      <h1 className="text-2xl font-bold">🌿 Land Registry DApp</h1>
      <ConnectButton />
    </nav>
  );
}
