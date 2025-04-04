"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-green-800 text-white">
      <h1 className="text-2xl font-bold">
        <Link href="/" className="hover:text-2.5xl transition-all duration-300">
        🌿 Land Registry DApp
        </Link>
        </h1>
      
      <div className="flex gap-6 items-center">
        <Link href="/userverification" className="hover:underline text-lg">
          User Verification
        </Link>
        <Link href="/transfer" className="hover:underline text-lg">
          Transfer
        </Link>
        <Link href="/register" className="hover:underline text-lg">
          Register
        </Link>
        <Link href="/auction" className="hover:underline text-lg">
          Auction
        </Link>
        <ConnectButton />
      </div>
    </nav>
  );
}
