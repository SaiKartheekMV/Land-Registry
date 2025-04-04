"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import landRegistryABI from "../../utils/landRegistryABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const UserVerification = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, landRegistryABI.abi, signer);

      const userAddress = await signer.getAddress();
      setAccount(userAddress);
      setContract(contractInstance);

      const contractOwner = await contractInstance.owner();
      setOwner(contractOwner);

      fetchUserDetails(userAddress, contractInstance);
    } catch (error) {
      console.error("⚠️ Error connecting wallet:", error);
    }
  };

  const fetchUserDetails = async (userAddress: string, contractInstance: ethers.Contract) => {
    try {
      const userDetails = await contractInstance.users(userAddress);
      if (userDetails.name) {
        setName(userDetails.name);
        setEmail(userDetails.email);
        setPhone(userDetails.phone);
        setIsRegistered(true);
        setIsVerified(userDetails.isVerified);
      }
    } catch (error) {
      console.error("⚠️ Error fetching user details:", error);
    }
  };

  const handleTransaction = async (action: () => Promise<any>, successMessage: string) => {
    try {
      setLoading(successMessage);
      const tx = await action();
      await tx.wait();
      alert(`✅ ${successMessage}`);
      fetchUserDetails(account!, contract!);
    } catch (error) {
      console.error(`❌ Transaction Failed:`, error);
      alert(`❌ ${successMessage} Failed`);
    } finally {
      setLoading(null);
    }
  };

  const registerUser = async () => {
    if (!contract) return;
    await handleTransaction(() => contract.registerUser(name, email, phone), "User Registered");
    setIsRegistered(true);
  };

  const updateUser = async () => {
    if (!contract) return;
    await handleTransaction(() => contract.updateUser(name, email, phone), "User Updated");
  };

  const verifyUser = async () => {
    if (!contract || account !== owner) return alert("⚠️ Only the contract owner can verify users!");
    await handleTransaction(() => contract.verifyUser(account!), "User Verified");
    setIsVerified(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">User Verification</h2>
      {account ? (
        <>
          <p className="text-gray-700 mb-2"><strong>Wallet:</strong> {account}</p>

          {!isRegistered ? (
            <div>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2"/>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-2"/>
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded mb-4"/>
              <button onClick={registerUser} className="w-full p-2 bg-blue-500 text-white rounded" disabled={loading !== null}>
                {loading === "User Registered" ? "Registering..." : "Register"}
              </button>
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p className={isVerified ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {isVerified ? "✅ Verified" : "❌ Not Verified"}
              </p>

              <button onClick={updateUser} className="w-full p-2 bg-yellow-500 text-white rounded mb-2" disabled={loading !== null}>
                {loading === "User Updated" ? "Updating..." : "Update Profile"}
              </button>

              {!isVerified && owner === account && (
                <button onClick={verifyUser} className="w-full p-2 bg-green-500 text-white rounded" disabled={loading !== null}>
                  {loading === "User Verified" ? "Verifying..." : "Verify User"}
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <button onClick={connectWallet} className="w-full p-2 bg-gray-800 text-white rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default UserVerification;
