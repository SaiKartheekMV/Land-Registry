"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import landRegistryABI from "@/utils/landRegistryABI.json";
import { motion } from "framer-motion";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [owner, setOwner] = useState<string | null>(null);
  const [availableLands, setAvailableLands] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isConnected) {
      checkUserRegistration();
      fetchAvailableLands();
    }
  }, [isConnected]);

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, provider);
  };

  const getOwner = async () => {
    try {
      if (!isConnected) {
        setError("Please connect your wallet first.");
        return;
      }

      setLoading(true);
      const contract = await getContract();
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching contract owner.");
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async () => {
    try {
      const contract = await getContract();
      const registered = await contract.isRegistered(address);
      setIsRegistered(registered);
    } catch (err) {
      console.error(err);
      setError("Error checking registration status.");
    }
  };

  const fetchAvailableLands = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const lands = await contract.getAvailableLands();
      setAvailableLands(lands);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching lands.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // Prevent SSR issues

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-6">
      <motion.section
        className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Wallet & Actions */}
        <motion.div
          className="bg-blue-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center border border-yellow-500/50"
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
                {loading ? "Fetching Owner..." : "Get Contract Owner"}
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

        {/* Contract Info */}
        <motion.div
          className="bg-blue-900 shadow-xl rounded-2xl p-8 w-full max-w-lg text-center border border-yellow-500/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-yellow-400">Contract Information</h2>
          {owner ? (
            <p className="mt-4 text-yellow-300 bg-blue-800 px-4 py-2 rounded-lg border border-yellow-500 shadow-md">
              Owner Address: {owner}
            </p>
          ) : (
            <p className="text-yellow-300 mt-2">No owner data fetched yet.</p>
          )}
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </motion.div>
      </motion.section>

      {/* Land Listings */}
      <motion.section
        className="mt-10 bg-blue-800 shadow-xl rounded-2xl p-8 w-full max-w-5xl border border-yellow-500/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-yellow-400 text-center">Available Lands for Sale</h2>
        {loading ? (
          <p className="text-center text-yellow-300 mt-4">Loading...</p>
        ) : availableLands.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {availableLands.map((land, index) => (
              <div
                key={index}
                className="bg-blue-900 p-4 rounded-lg shadow-md border border-yellow-500"
              >
                <p className="text-yellow-300">🏡 <b>Location:</b> {land.location}</p>
                <p className="text-yellow-400">💰 <b>Price:</b> {ethers.formatEther(land.price)} ETH</p>
                <p className="text-yellow-500">🆔 <b>Land ID:</b> {land.id.toString()}</p>
                <button
                  className="mt-3 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Buy Land
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-yellow-300 text-center mt-4">No lands available for sale.</p>
        )}
      </motion.section>
    </main>
  );
}
