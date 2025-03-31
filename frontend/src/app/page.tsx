"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import landRegistryABI from "../utils/landRegistryABI.json"; // ✅ Correct relative path
import { motion } from "framer-motion";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
if (!CONTRACT_ADDRESS) {
  throw new Error("❌ NEXT_PUBLIC_CONTRACT_ADDRESS is missing from .env.local");
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [owner, setOwner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getOwner = async () => {
    try {
      if (!isConnected) {
        setError("Please connect your wallet first.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, provider);
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching owner address.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white p-6">
      {/* Header Section */}
      <header className="w-full flex justify-between items-center p-4 bg-green-800 shadow-lg border-b border-yellow-500/50 rounded-lg">
        <motion.h1
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Land Registry DApp
        </motion.h1>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10 w-full max-w-5xl">
        {/* Wallet Section */}
        <motion.div
          className="bg-green-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center border border-yellow-500/50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {isConnected ? (
            <>
              <p className="text-yellow-400 text-sm">Connected Wallet:</p>
              <p className="font-mono text-lg text-yellow-300">{address}</p>
              <motion.button
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={getOwner}
              >
                Get Contract Owner
              </motion.button>
              <motion.button
                className="mt-4 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => disconnect()}
              >
                Disconnect
              </motion.button>
            </>
          ) : (
            <p className="text-yellow-300 mt-6 text-sm">Connect your wallet to interact with the contract.</p>
          )}
        </motion.div>

        {/* Contract Info Section */}
        <motion.div
          className="bg-green-900 shadow-xl rounded-2xl p-8 w-full max-w-lg text-center border border-yellow-500/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-yellow-400">Contract Information</h2>
          {owner ? (
            <p className="mt-4 text-yellow-300 bg-green-800 px-4 py-2 rounded-lg border border-yellow-500 shadow-md">
              Owner Address: {owner}
            </p>
          ) : (
            <p className="text-yellow-300 mt-2">No owner data fetched yet.</p>
          )}
          {error && (
            <p className="mt-4 text-red-400">{error}</p>
          )}
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="mt-10 w-full text-center p-4 text-yellow-400 bg-green-800 rounded-lg border-t border-yellow-500/50">
        <p>© {new Date().getFullYear()} Land Registry DApp - Built with Web3</p>
      </footer>
    </main>
  );
}
