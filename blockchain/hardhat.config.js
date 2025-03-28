require("@nomicfoundation/hardhat-verify");
require("dotenv").config(); // Ensure you have dotenv to manage secrets

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL, // Your Infura/Alchemy RPC URL
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Your Etherscan API Key
  },
};
