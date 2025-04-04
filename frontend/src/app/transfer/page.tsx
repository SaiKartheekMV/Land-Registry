"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import landRegistryABI from "@/utils/landRegistryABI.json";
import useSWR from "swr";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const fetchLandDetails = async (landID: string) => {
  if (!landID) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, provider);
  const land = await contract.lands(landID);
  return land;
};

export default function TransferOwnership() {
  const [landID, setLandID] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { data: land, mutate, isLoading } = useSWR(landID, fetchLandDetails, {
    refreshInterval: 3000,
  });

  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    };
    getWalletAddress();
  }, []);

  const transferLand = async () => {
    setError("");
    setSuccess("");

    if (!landID || !newOwner) {
      setError("Please enter both Land ID and New Owner address.");
      return;
    }

    if (!ethers.isAddress(newOwner)) {
      setError("Invalid Ethereum address");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

      const tx = await contract.transferOwnership(landID, newOwner);
      await tx.wait();

      setSuccess("Land ownership transferred successfully!");
      mutate(); // Re-fetch land data
    } catch (err: any) {
      console.error(err);
      setError(err?.reason || "Failed to transfer ownership");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-900 rounded-xl shadow-md text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">🔁 Transfer Land Ownership</h1>

      <input
        className="w-full p-2 mb-3 rounded bg-gray-800"
        placeholder="Enter Land ID"
        value={landID}
        onChange={(e) => {
          setLandID(e.target.value);
          setSuccess("");
          setError("");
        }}
      />

      {isLoading ? (
        <p className="text-gray-400">Loading land details...</p>
      ) : land ? (
        <div className="mb-4 text-sm">
          <p>📌 <span className="font-semibold">Current Owner:</span> {land.owner}</p>
          <p>🏷️ <span className="font-semibold">Area:</span> {land.area}</p>
          <p>📍 <span className="font-semibold">Location:</span> {land.location}</p>
        </div>
      ) : (
        landID && <p className="text-red-400 text-sm">Land not found or invalid ID</p>
      )}

      {userAddress && (
        <p className="text-sm text-gray-500 mb-2">🔐 Your Address: {userAddress}</p>
      )}

      {land && userAddress.toLowerCase() !== land.owner.toLowerCase() && (
        <p className="text-red-500 mb-3">❌ You are not the owner of this land</p>
      )}

      <input
        className="w-full p-2 mb-3 rounded bg-gray-800"
        placeholder="Enter New Owner Address"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
      />

      <button
        onClick={transferLand}
        disabled={!land || userAddress.toLowerCase() !== land.owner.toLowerCase()}
        className="w-full p-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        Transfer Ownership
      </button>

      {success && <p className="mt-4 text-green-400 font-medium">{success}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
