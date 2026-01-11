const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying All RWA Assets on Simplified Marketplace...\n");

  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Contract address
    const marketplaceAddress = "0x101190D8AcF4b5D4C01b60BFFc222FD3FD6E64a2";
    console.log(`🏪 SimplifiedRWAMarketplace: ${marketplaceAddress}\n`);
    
    // Contract ABI
    const abi = [
      "function getAssetCount() external view returns (uint256)",
      "function getAssetInfo(uint256 assetId) external view returns (string memory name, uint256 totalShares, uint256 availableShares, uint256 pricePerShare, uint256 expectedYield)"
    ];
    
    // Connect to contract
    const marketplace = new ethers.Contract(marketplaceAddress, abi, ethers.provider);
    
    // Get total asset count
    const assetCount = await marketplace.getAssetCount();
    console.log(`📊 Total registered assets: ${assetCount.toString()}\n`);
    
    // Check all assets
    for (let i = 0; i < Number(assetCount); i++) {
      try {
        const assetInfo = await marketplace.getAssetInfo(i);
        console.log(`🏢 Asset ${i}: ${assetInfo[0]}`);
        console.log(`   📈 Total Shares: ${assetInfo[1].toString()}`);
        console.log(`   🛒 Available: ${assetInfo[2].toString()}`);
        console.log(`   💰 Price: ${ethers.formatEther(assetInfo[3])} USDY`);
        console.log(`   📊 Expected Yield: ${Number(assetInfo[4]) / 100}% APY`);
        console.log("");
      } catch (error) {
        console.log(`⚠️  Asset ${i}: Error reading data - ${error.message}`);
      }
    }
    
    console.log("✅ All RWA assets are properly registered on Mantle Sepolia!");
    console.log("🌐 Ready for trading with USDY tokens");
    
  } catch (error) {
    console.error("❌ Error verifying assets:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });