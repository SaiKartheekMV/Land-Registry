"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-green-900 text-white flex flex-col items-center p-6">
      <Navbar />
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">Welcome to the Land Registry DApp</h1>
        <p className="mt-4">Securely register and manage land ownership on blockchain.</p>
      </div>
      <div className="mt-6 flex gap-4">
        <Link href="/register" className="bg-yellow-500 p-3 rounded-lg">Register Land</Link>
        <Link href="/transfer" className="bg-blue-500 p-3 rounded-lg">Transfer Land</Link>
        <Link href="/auctions" className="bg-red-500 p-3 rounded-lg">Auction</Link>
      </div>
    </main>
  );
}
