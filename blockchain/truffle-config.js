module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 8000000, // Increase this if needed
      gasPrice: 20000000000  // 20 gwei
    },
  },
  
  compilers: {
    solc: {
      version: "0.8.21", // Replace with your Solidity version
    },
  },
};
