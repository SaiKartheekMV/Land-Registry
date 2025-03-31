"use client";

import { useState } from "react";
import { ethers } from "ethers";
import landRegistryABI from "../utils/landRegistryABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export default function RegisterLandForm() {
  const [landID, setLandID] = useState("");
  const [owner, setOwner] = useState("");
  const [error, setError] = useState("");

  const registerLand = async () => {
    try {
      if (!landID || !owner) {
        setError("All fields are required");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

      const tx = await contract.registerLand(landID, owner);
      await tx.wait();

      alert("Land registered successfully!");
    } catch (err) {
      console.error(err);
      setError("Error registering land.");
    }
  };

  return (
    <div className="p-6 bg-green-800 rounded-lg text-white">
      <h2 className="text-xl font-semibold">Register Land</h2>
      <input className="block w-full mt-2 p-2" placeholder="Land ID" onChange={(e) => setLandID(e.target.value)} />
      <input className="block w-full mt-2 p-2" placeholder="Owner Address" onChange={(e) => setOwner(e.target.value)} />
      <button className="mt-4 bg-yellow-500 p-2" onClick={registerLand}>Register</button>
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
