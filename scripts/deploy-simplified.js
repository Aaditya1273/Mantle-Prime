const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Simplified RWA Marketplace on Mantle Sepolia...\n");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deploying with account: ${deployer.address}`);
  
  // Get balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} MNT\n`);

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  try {
    // Mock USDY address (from environment)
    const mockUSDYAddress = process.env.NEXT_PUBLIC_MOCK_USDY_ADDRESS || "0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9";
    console.log(`🪙 Using Mock USDY at: ${mockUSDYAddress}`);

    // Deploy SimplifiedRWAMarketplace
    console.log("\n📋 Deploying SimplifiedRWAMarketplace...");
    const SimplifiedRWAMarketplace = await ethers.getContractFactory("SimplifiedRWAMarketplace");
    const marketplace = await SimplifiedRWAMarketplace.deploy(mockUSDYAddress);
    
    console.log(`⏳ Transaction hash: ${marketplace.deploymentTransaction().hash}`);
    await marketplace.waitForDeployment();
    
    const marketplaceAddress = await marketplace.getAddress();
    console.log(`✅ SimplifiedRWAMarketplace deployed to: ${marketplaceAddress}`);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const assetCount = await marketplace.getAssetCount();
    console.log(`📊 Pre-registered assets: ${assetCount.toString()}`);

    // Check first few assets
    for (let i = 0; i < Math.min(Number(assetCount), 3); i++) {
      try {
        const assetInfo = await marketplace.getAssetInfo(i);
        console.log(`🏢 Asset ${i}: ${assetInfo[0]} - ${assetInfo[1].toString()} shares at ${ethers.formatEther(assetInfo[3])} USDY`);
      } catch (error) {
        console.log(`⚠️  Asset ${i}: Error reading info`);
      }
    }

    // Save deployment info
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        SimplifiedRWAMarketplace: marketplaceAddress
      },
      tokens: {
        MockUSDY: mockUSDYAddress
      }
    };

    const fs = require('fs');
    fs.writeFileSync(
      `deployment-simplified-${network.chainId}.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`\n💾 Deployment info saved to deployment-simplified-${network.chainId}.json`);
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📝 Update your .env.local file:");
    console.log(`NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS=${marketplaceAddress}`);

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });