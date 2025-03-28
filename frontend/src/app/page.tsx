"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from '@wagmi/core';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h1 className="text-4xl font-bold">Land Registry Blockchain</h1>
      <p className="mt-4 text-lg">Securely manage land ownership with blockchain.</p>
      
      {isConnected ? (
        <div className="mt-6">
          <p className="text-lg">Connected as: {address}</p>
          <button
            onClick={disconnect}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="mt-6 px-6 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-200"
        >
          Connect Wallet
        </button>
      )}
    </main>
  );
}
