"use client";

import { useState } from "react";
import { ethers } from "ethers";
import landRegistryABI from "../utils/landRegistryABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function TransferOwnership() {
  const [landID, setLandID] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [error, setError] = useState("");

  const transferLand = async () => {
    try {
      if (!landID || !newOwner) {
        setError("All fields are required");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

      const tx = await contract.transferOwnership(landID, newOwner);
      await tx.wait();

      alert("Land ownership transferred successfully!");
    } catch (err) {
      console.error(err);
      setError("Error transferring land.");
    }
  };

  return (
    <div className="p-6 bg-blue-800 rounded-lg text-white">
      <h2 className="text-xl font-semibold">Transfer Land Ownership</h2>
      <input className="block w-full mt-2 p-2" placeholder="Land ID" onChange={(e) => setLandID(e.target.value)} />
      <input className="block w-full mt-2 p-2" placeholder="New Owner Address" onChange={(e) => setNewOwner(e.target.value)} />
      <button className="mt-4 bg-yellow-500 p-2" onClick={transferLand}>Transfer</button>
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
