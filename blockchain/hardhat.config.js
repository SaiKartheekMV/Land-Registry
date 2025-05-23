require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config(); 

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL, 
      accounts: [process.env.PRIVATE_KEY], 
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, 
  },
};
