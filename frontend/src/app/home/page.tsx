"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import landRegistryABI from "@/utils/landRegistryABI.json";
import { motion } from "framer-motion";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !address) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, provider);
        const user = await contract.users(address);

        setUserData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [address, isConnected]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏡 Land Registry DApp</h1>
        <ConnectButton />
      </header>

      {isConnected && address && (
        <section className="bg-green-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">👤 User Details</h2>
          {userData ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p>
                <strong>Status:</strong>{" "}
                {userData.isVerified ? (
                  <span className="text-green-400">Verified ✅</span>
                ) : (
                  <span className="text-yellow-400">Pending Verification ⏳</span>
                )}
              </p>
            </div>
          ) : (
            <p>No user data found. Please register.</p>
          )}
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-2">📄 Register Land</h3>
          <p>Submit your land details for verification and ownership registration.</p>
          <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Register Land
          </button>
        </motion.div>

        <motion.div
          className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-2">🛒 List Land for Sale</h3>
          <p>Put your verified land on the market for potential buyers.</p>
          <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            List Land
          </button>
        </motion.div>

        <motion.div
          className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-semibold mb-2">⚔️ Participate in Auctions</h3>
          <p>Bid on lands currently up for auction and expand your holdings.</p>
          <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            View Auctions
          </button>
        </motion.div>
      </section>

      {error && <p className="mt-6 text-red-400">{error}</p>}
    </main>
  );
}
