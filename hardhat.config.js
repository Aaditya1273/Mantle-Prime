require("@nomicfoundation/hardhat-ethers");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback

// Use a dummy private key if real one is missing to allow compilation
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // For complex contracts
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    "mantle-testnet": {
      url: "https://rpc.sepolia.mantle.xyz", // Mantle Sepolia RPC
      accounts: [PRIVATE_KEY],
      chainId: 5003,
      timeout: 60000,
      gasPrice: 1000000000, // 1 gwei (reduced from 20 gwei)
    },
    "mantle-mainnet": {
      url: "https://rpc.mantle.xyz",
      accounts: [PRIVATE_KEY], 
      chainId: 5000,
      timeout: 60000,
      gasPrice: 20000000000, // 20 gwei
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};