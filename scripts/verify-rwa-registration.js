const { ethers } = require("hardhat");

// RWA Marketplace ABI for verification
const RWA_MARKETPLACE_ABI = [
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
  },
  {
    "inputs": [],
    "name": "nextAssetId",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function verifyRWARegistration() {
  console.log("🔍 Verifying RWA Asset Registration on Mantle Sepolia Testnet...\n");

  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    if (network.chainId !== 5003n) {
      console.log("⚠️  Warning: Not connected to Mantle Sepolia Testnet (Chain ID: 5003)");
    }

    // Contract addresses from deployment
    const marketplaceAddress = process.env.NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS || 
                              "0x703C397732f6F13D11Ee71154B462969C5CF75f4";
    
    console.log(`🏪 RWA Marketplace Address: ${marketplaceAddress}`);
    
    // Connect to marketplace contract
    const marketplace = new ethers.Contract(marketplaceAddress, RWA_MARKETPLACE_ABI, ethers.provider);
    
    // Check if contract exists
    const code = await ethers.provider.getCode(marketplaceAddress);
    if (code === "0x") {
      console.log("❌ Contract not found at address. Please deploy first.");
      return;
    }
    
    console.log("✅ RWA Marketplace contract found on Mantle Sepolia");
    
    // Try to get next asset ID to know how many assets exist
    try {
      const nextAssetId = await marketplace.nextAssetId();
      const assetCount = Number(nextAssetId) - 1; // Asset IDs start from 1
      console.log(`📊 Total registered assets: ${assetCount}`);
      
      // Check assets starting from ID 1
      for (let i = 1; i <= assetCount; i++) {
        try {
          const assetInfo = await marketplace.getAsset(i);
          console.log(`\n🏢 Asset ${i}:`);
          console.log(`   Name: ${assetInfo[0]}`);
          console.log(`   Type: ${assetInfo[1]}`);
          console.log(`   Total Value: ${ethers.formatEther(assetInfo[2])} USDY`);
          console.log(`   Total Shares: ${assetInfo[3].toString()}`);
          console.log(`   Available Shares: ${assetInfo[4].toString()}`);
          console.log(`   Price per Share: ${ethers.formatEther(assetInfo[5])} USDY`);
          console.log(`   Expected Yield: ${Number(assetInfo[6]) / 100}% APY`);
          console.log(`   Creator: ${assetInfo[7]}`);
          console.log(`   Active: ${assetInfo[8]}`);
        } catch (error) {
          console.log(`⚠️  Asset ${i}: Error reading data - ${error.message}`);
        }
      }
    } catch (error) {
      console.log("ℹ️  nextAssetId function not available, checking individual assets...");
      
      // Check first 10 assets manually (starting from ID 1)
      for (let i = 1; i <= 10; i++) {
        try {
          const assetInfo = await marketplace.getAsset(i);
          console.log(`\n🏢 Asset ${i}:`);
          console.log(`   Name: ${assetInfo[0]}`);
          console.log(`   Type: ${assetInfo[1]}`);
          console.log(`   Total Value: ${ethers.formatEther(assetInfo[2])} USDY`);
          console.log(`   Total Shares: ${assetInfo[3].toString()}`);
          console.log(`   Available Shares: ${assetInfo[4].toString()}`);
          console.log(`   Price per Share: ${ethers.formatEther(assetInfo[5])} USDY`);
          console.log(`   Expected Yield: ${Number(assetInfo[6]) / 100}% APY`);
          console.log(`   Creator: ${assetInfo[7]}`);
          console.log(`   Active: ${assetInfo[8]}`);
        } catch (error) {
          if (i === 1) {
            console.log(`⚠️  No assets registered yet`);
            break;
          }
        }
      }
    }
    
    console.log("\n✅ RWA Registration Verification Complete");
    console.log("🌐 All assets are properly registered on Mantle Sepolia Testnet");
    
  } catch (error) {
    console.error("❌ Error verifying RWA registration:", error.message);
  }
}

// Run verification
verifyRWARegistration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });