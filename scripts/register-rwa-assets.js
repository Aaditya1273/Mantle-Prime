const { ethers } = require("hardhat");

// RWA Marketplace ABI for asset registration
const RWA_MARKETPLACE_ABI = [
  {
    "inputs": [
      {"type": "string", "name": "name"},
      {"type": "string", "name": "assetType"},
      {"type": "uint256", "name": "totalValue"},
      {"type": "uint256", "name": "totalShares"},
      {"type": "uint256", "name": "pricePerShare"},
      {"type": "uint256", "name": "expectedYield"}
    ],
    "name": "createAsset",
    "outputs": [{"type": "uint256", "name": "assetId"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "assetId"}],
    "name": "getAsset",
    "outputs": [
      {"type": "string", "name": "name"},
      {"type": "string", "name": "assetType"},
      {"type": "uint256", "name": "totalValue"},
      {"type": "uint256", "name": "totalShares"},
      {"type": "uint256", "name": "availableShares"},
      {"type": "uint256", "name": "pricePerShare"},
      {"type": "uint256", "name": "expectedYield"},
      {"type": "address", "name": "creator"},
      {"type": "bool", "name": "isActive"},
      {"type": "uint256", "name": "createdAt"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function registerRWAAssets() {
  console.log("🚀 Registering RWA Assets on Mantle Sepolia Testnet...\n");

  try {
    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer address: ${deployer.address}`);
    
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Contract address
    const marketplaceAddress = process.env.NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS || 
                              "0x703C397732f6F13D11Ee71154B462969C5CF75f4";
    
    console.log(`🏪 RWA Marketplace: ${marketplaceAddress}\n`);
    
    // Connect to marketplace contract
    const marketplace = new ethers.Contract(marketplaceAddress, RWA_MARKETPLACE_ABI, deployer);
    
    // RWA Assets to register (matching the frontend data)
    const assets = [
      {
        name: "Miami Beach Luxury Apartment",
        assetType: "Real Estate",
        totalShares: 10000,
        pricePerShare: ethers.parseEther("50"), // 50 USDY
        expectedYield: 800 // 8.00% (basis points)
      },
      {
        name: "Corporate Bond Portfolio",
        assetType: "Private Debt",
        totalShares: 20000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 650 // 6.50%
      },
      {
        name: "Renewable Energy Project",
        assetType: "Infrastructure",
        totalShares: 15000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 920 // 9.20%
      },
      {
        name: "Commercial Real Estate Fund",
        assetType: "Real Estate",
        totalShares: 40000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 750 // 7.50%
      },
      {
        name: "Japanese Art Collection Fund",
        assetType: "Alternative",
        totalShares: 6000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 1200 // 12.00%
      },
      {
        name: "Logistics Warehouse Portfolio",
        assetType: "Real Estate",
        totalShares: 24000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 780 // 7.80%
      },
      {
        name: "Private Credit Fund",
        assetType: "Private Debt",
        totalShares: 16000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 850 // 8.50%
      },
      {
        name: "Student Housing Complex",
        assetType: "Real Estate",
        totalShares: 12000,
        pricePerShare: ethers.parseEther("50"),
        expectedYield: 880 // 8.80%
      }
    ];

    console.log(`📋 Registering ${assets.length} RWA assets...\n`);

    // Register each asset
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      
      try {
        console.log(`🏢 Creating Asset ${i}: ${asset.name}`);
        
        // Calculate total value
        const totalValue = BigInt(asset.totalShares) * asset.pricePerShare;
        
        const tx = await marketplace.createAsset(
          asset.name,
          asset.assetType,
          totalValue,
          asset.totalShares,
          asset.pricePerShare,
          asset.expectedYield
        );
        
        console.log(`   📝 Transaction hash: ${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`   ✅ Confirmed in block: ${receipt.blockNumber}`);
        
        // Verify registration
        try {
          const assetInfo = await marketplace.getAsset(i + 1); // Asset IDs start from 1
          console.log(`   📊 Verified: ${assetInfo[0]} - ${assetInfo[3].toString()} shares at ${ethers.formatEther(assetInfo[5])} USDY each`);
        } catch (error) {
          console.log(`   ⚠️  Could not verify asset info: ${error.message}`);
        }
        
        console.log("");
        
      } catch (error) {
        console.error(`   ❌ Failed to register ${asset.name}:`, error.message);
      }
    }
    
    console.log("🎉 RWA Asset Registration Complete!");
    console.log("🌐 All assets are now registered on Mantle Sepolia Testnet");
    
  } catch (error) {
    console.error("❌ Error registering RWA assets:", error.message);
  }
}

// Run registration
registerRWAAssets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });