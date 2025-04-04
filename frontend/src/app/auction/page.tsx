"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import landRegistryABI from "../../utils/landRegistryABI.json";
import useSWR from "swr";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const fetchAuctionData = async (landID: string) => {
  if (!landID) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, provider);
  return await contract.auctions(landID);
};

const fetchLandOwner = async (landID: string) => {
  if (!landID) return "";
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, provider);
  const land = await contract.lands(landID);
  return land.owner;
};

export default function LandAuctionPage() {
  const [landID, setLandID] = useState("");
  const [minBid, setMinBid] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [user, setUser] = useState("");
  const [landOwner, setLandOwner] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: auction, mutate } = useSWR(landID, fetchAuctionData, { refreshInterval: 4000 });

  useEffect(() => {
    const getWallet = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUser(address);
      } catch (err) {
        console.error("Wallet error:", err);
      }
    };
    getWallet();
  }, []);

  useEffect(() => {
    if (!landID) return;
    fetchLandOwner(landID).then(setLandOwner);
  }, [landID]);

  const handleTransaction = async (promise: Promise<any>, successMsg: string) => {
    try {
      const tx = await promise;
      await tx.wait();
      setSuccess(successMsg);
      setError("");
      mutate();
    } catch (err: any) {
      console.error(err);
      setError(err.reason || "Transaction failed");
      setSuccess("");
    }
  };

  const startAuction = async () => {
    if (!landID || !minBid) return setError("Please enter Land ID and Minimum Bid");
    if (user.toLowerCase() !== landOwner.toLowerCase()) return setError("Only the land owner can start an auction");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

    await handleTransaction(
      contract.startAuction(landID, ethers.parseEther(minBid)),
      "Auction started successfully"
    );
  };

  const placeBid = async () => {
    if (!bidAmount) return setError("Enter your bid amount");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

    await handleTransaction(
      contract.placeBid(landID, { value: ethers.parseEther(bidAmount) }),
      "Bid placed successfully"
    );
  };

  const cancelAuction = async () => {
    if (user.toLowerCase() !== landOwner.toLowerCase()) return setError("Only the land owner can cancel the auction");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

    await handleTransaction(contract.cancelAuction(landID), "Auction cancelled successfully");
  };

  const finalizeAuction = async () => {
    if (user.toLowerCase() !== landOwner.toLowerCase()) return setError("Only the land owner can finalize the auction");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

    await handleTransaction(contract.finalizeAuction(landID), "Auction finalized successfully");
  };

  const withdrawBid = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

    await handleTransaction(contract.withdrawBid(landID), "Bid withdrawn successfully");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">🏡 Land Auction</h1>

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

      {landOwner && <p className="text-sm text-gray-400 mb-1">Land Owner: {landOwner}</p>}
      {user && <p className="text-sm text-gray-500 mb-2">Your Address: {user}</p>}

      {auction?.isActive ? (
        <>
          <p className="text-green-400 font-bold">🔥 Auction Active</p>
          <p className="mt-1">Highest Bid: {ethers.formatEther(auction.highestBid || "0")} ETH</p>
          <p>Highest Bidder: {auction.highestBidder}</p>

          {user.toLowerCase() !== landOwner.toLowerCase() ? (
            <>
              <input
                className="w-full p-2 mt-4 mb-2 rounded bg-gray-800"
                placeholder="Enter Bid (ETH)"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <button onClick={placeBid} className="w-full p-2 mb-2 bg-blue-600 rounded hover:bg-blue-700">
                Place Bid
              </button>
              <button onClick={withdrawBid} className="w-full p-2 bg-yellow-600 rounded hover:bg-yellow-700">
                Withdraw Bid
              </button>
            </>
          ) : (
            <>
              <button onClick={cancelAuction} className="w-full p-2 mt-4 bg-red-600 rounded hover:bg-red-700">
                Cancel Auction
              </button>
              <button onClick={finalizeAuction} className="w-full p-2 mt-2 bg-green-600 rounded hover:bg-green-700">
                Finalize Auction
              </button>
            </>
          )}
        </>
      ) : (
        landOwner &&
        user.toLowerCase() === landOwner.toLowerCase() && (
          <>
            <input
              className="w-full p-2 mt-4 mb-2 rounded bg-gray-800"
              placeholder="Minimum Bid (ETH)"
              type="number"
              value={minBid}
              onChange={(e) => setMinBid(e.target.value)}
            />
            <button onClick={startAuction} className="w-full p-2 bg-green-600 rounded hover:bg-green-700">
              Start Auction
            </button>
          </>
        )
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}
