module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Ganache running locally
      port: 7545,        // Default Ganache port
      network_id: "*",   // Match any network id (fixes your error)
    },
  },
  compilers: {
    solc: {
      version: "0.8.21", // Replace with your Solidity version
    },
  },
};
