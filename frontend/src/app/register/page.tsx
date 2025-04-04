"use client";

import { useState } from "react";
import { ethers } from "ethers";
import landRegistryABI from "../../utils/landRegistryABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function RegisterLand() {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simulate user verification (replace with real logic)
  const verifyUser = async () => {
    try {
      setLoading(true);
      // Mock verification delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsVerified(true);
      setSuccess("✅ User verified successfully!");
    } catch {
      setError("❌ Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const registerLand = async () => {
    try {
      if (!location || !price || !document) {
        setError("All fields, including document upload, are required.");
        return;
      }

      if (!isVerified) {
        setError("You must be verified before registering land.");
        return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

      const tx = await contract.registerLand(location, ethers.parseEther(price));
      await tx.wait();

      setTransactionHash(tx.hash);
      setSuccess("✅ Land registered successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Error registering land.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-center">Register Your Land</h2>

      {/* Land Location */}
      <input
        className="block w-full mt-3 p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none"
        placeholder="Land Location"
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Price */}
      <input
        className="block w-full mt-3 p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none"
        placeholder="Price in ETH"
        type="number"
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* Upload Document */}
      <input
        type="file"
        className="block w-full mt-3 p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none"
        onChange={(e) => setDocument(e.target.files?.[0] || null)}
      />
      {document && <p className="text-green-400 text-sm mt-1">📄 {document.name} uploaded</p>}

      {/* User Verification Status */}
      <button
        className={`mt-4 w-full p-2 rounded-lg text-white transition ${
          isVerified ? "bg-green-500 cursor-default" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={!isVerified ? verifyUser : undefined}
        disabled={isVerified || loading}
      >
        {isVerified ? "✅ Verified User" : "🔍 Verify User"}
      </button>
      <p className={`mt-2 text-sm ${isVerified ? "text-green-400" : "text-red-400"}`}>
        {isVerified ? "✅ You are verified" : "⚠️ You are not verified"}
      </p>

      {/* Register Button */}
      <button
        className="mt-4 w-full bg-green-500 p-2 rounded-lg hover:bg-green-600 transition"
        onClick={registerLand}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register Land"}
      </button>

      {/* Success/Error Messages */}
      {error && <p className="mt-2 text-red-400">{error}</p>}
      {success && <p className="mt-2 text-green-400">{success}</p>}

      {/* Display Transaction Hash */}
      {transactionHash && (
        <p className="mt-2 text-blue-400 text-sm">
          ✅ Transaction Hash:{" "}
          <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" className="underline">
            View on Etherscan
          </a>
        </p>
      )}
    </div>
  );
}
