How to Create Smart Contracts for Mantle Prime on Mantle Network
Mantle Network is fully EVM-compatible, so you create, compile, test, and deploy smart contracts exactly like on Ethereum—using tools like Hardhat (recommended for beginners and hackathons) or Foundry.
No special changes are needed beyond configuring the Mantle RPC and chain ID. For your Mantle Prime idea (RWA Credit Marketplace using mETH collateral for credit lines to buy fractional RWAs), you'll need:

Core contracts: A vault for mETH collateral (earning staking yields), a credit minting mechanism, an RWA tokenization/store for fractional assets, and compliance stubs (e.g., ZK-KYC whitelist).
Integrations: mETH (Mantle's liquid staked ETH) contract on Ethereum L1: 0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa (note: mETH is primarily on L1; bridge to Mantle L2 if needed via official bridge).
USDY (Ondo yield-bearing USD on Mantle): 0x5be26527e817998a7206475496fde1e68957c5a6.
For credit lines, consider using a stable like USDT0 or USDY.

Steps to Build:

Install Node.js (v18+ recommended).
Create a project: mkdir mantle-prime && cd mantle-prime
Initialize Hardhat: npx hardhat (choose "Create a basic sample project").
Install dependencies: npm install --save-dev @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
Write contracts in contracts/.
Test in test/.
Deploy via scripts in scripts/.
Deploy to Mantle Testnet first (faucet for test MNT), then mainnet.

Recommended Folder Structure for Mantle Prime (Hardhat Project)
This is a clean, scalable structure based on standard Hardhat best practices, adapted for an RWA/DeFi project like Mantle Prime. It keeps things organized: core logic separate from utilities, mocks for testing external tokens (mETH/USDY), and compliance modules.
textmantle-prime/
├── contracts/                  # All Solidity files (.sol)
│   ├── core/                   # Main project contracts
│   │   ├── MantlePrimeVault.sol  # Handles mETH deposits, staking yield accrual, collateral
│   │   ├── CreditLine.sol        # Mints credit lines (e.g., in USDT0/USDY) based on collateral
│   │   ├── RWAStore.sol          # Tokenization & fractional sales of RWAs (ERC721 or ERC1155 fractions)
│   │   └── MantlePrime.sol       # Factory or main entrypoint contract orchestrating flows
│   ├── interfaces/             # External interfaces
│   │   ├── ImETH.sol             # Interface for mETH (staking/rewards)
│   │   └── IUSDY.sol             # Interface for USDY if needed
│   ├── compliance/             # Regulatory/KYC modules
│   │   ├── ZkKycStub.sol         # Simple whitelist or ZK-proof stub for institutional access
│   │   └── AccessControl.sol     # Role-based access (e.g., for institutions tokenizing assets)
│   ├── tokens/                 # Custom tokens if needed
│   │   └── FractionalRWA.sol     # ERC20/721 for fractionalized real estate/debt
│   └── utils/                  # Helpers/Reusables
│       └── YieldOptimizer.sol    # Logic for yield-on-yield (mETH staking + RWA yields)
├── scripts/                    # Deployment & interaction scripts
│   ├── deploy.js               # Main deployment script (deploys all contracts)
│   └── seedRwa.js              # Optional: Script to mock/tokenize sample RWAs for demo
├── test/                       # Tests (Mocha/Chai)
│   ├── unit/                   # Unit tests
│   │   ├── Vault.test.js
│   │   ├── CreditLine.test.js
│   │   └── RWAStore.test.js
│   └── integration/            # Full flow tests (deposit -> credit -> buy RWA)
│       └── FullFlow.test.js
├── mocks/                      # Mock contracts for testing (optional but useful for externals)
│   └── MockMETH.sol            # Mock mETH for local/testing (since real is on L1)
├── hardhat.config.js           # Config: Networks (Mantle mainnet/testnet), solidity version
├── .env                        # Private keys, API keys (gitignored)
├── package.json
├── README.md                   # Project docs, deployment instructions (required for hackathon)
└── artifacts/ & cache/         # Auto-generated (ignore in git)
Why this structure?

Modular: Separates concerns (core, compliance, utils) for easier maintenance and auditing—critical for RWA projects.
Hackathon-friendly: Clear for judges; easy to add demo scripts and compliance roadmap in README.
Scalable: If you add AI/oracles or more tracks, expand folders.
Testing focus: Dedicated unit/integration for your 17+ tests goal.

Quick Setup Example (hardhat.config.js)
JavaScriptrequire("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",  // Latest stable; use optimizer for gas efficiency
  networks: {
    mantleTestnet: {
      url: "https://rpc.testnet.mantle.xyz",
      chainId: 5001,
      accounts: [process.env.PRIVATE_KEY],
    },
    mantleMainnet: {
      url: "https://rpc.mantle.xyz",
      chainId: 5000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {  // For verification on Mantle explorer
    apiKey: { mantle: "abc" },  // Placeholder; use actual if needed
    customChains: [...]  // Add Mantle chains if verifying
  },
};
Tips for Mantle Prime MVP (1 Days Left)

Start with Vault.sol: Accept mETH deposits, track yields (use mETH's rebasing or query rewards).
Killer feature: Over-collateralize mETH → mint stable credit → buy fractional RWA while earning double yield.
Mock RWAs for demo (e.g., fake real estate token).
Add compliance doc in root: "Regulatory Roadmap.md" explaining ZK-KYC stub.
Demo video: Show full flow on testnet.

This setup will get you a professional, submittable projectfast. Deploy to testnet, record the demo, and push to GitHub. Good luck with the hackathon—you've got a winning idea! If you need sample contract code snippets, let me know.