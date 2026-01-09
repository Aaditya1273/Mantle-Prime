const { ethers } = require("hardhat");

async function main() {
  console.log("🌱 Seeding RWA Marketplace with Sample Assets...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Seeding with account:", deployer.address);

  // Load deployed contract addresses
  const deploymentFile = `deployment-5003.json`;
  let deployment;
  try {
    deployment = require(`../${deploymentFile}`);
  } catch (error) {
    console.error("❌ Deployment file not found. Please deploy contracts first.");
    process.exit(1);
  }

  // Connect to RWA Marketplace
  const RWAMarketplace = await ethers.getContractFactory("RWAMarketplace");
  const marketplace = RWAMarketplace.attach(deployment.contracts.RWAMarketplace);

  console.log("Connected to RWAMarketplace:", deployment.contracts.RWAMarketplace);

  // Sample RWA Assets to create
  const sampleAssets = [
    {
      name: "Miami Beach Luxury Apartment",
      assetType: "real_estate",
      totalValue: ethers.parseUnits("500000", 6), // $500k USDY
      totalShares: 10000n,
      pricePerShare: ethers.parseUnits("50", 6), // $50 per share
      expectedYield: 800n // 8% APY in basis points
    },
    {
      name: "Corporate Bond Portfolio",
      assetType: "private_debt", 
      totalValue: ethers.parseUnits("1000000", 6), // $1M USDY
      totalShares: 20000n,
      pricePerShare: ethers.parseUnits("50", 6), // $50 per share
      expectedYield: 650n // 6.5% APY
    },
    {
      name: "Renewable Energy Project",
      assetType: "infrastructure",
      totalValue: ethers.parseUnits("750000", 6), // $750k USDY
      totalShares: 15000n,
      pricePerShare: ethers.parseUnits("50", 6), // $50 per share
      expectedYield: 920n // 9.2% APY
    },
    {
      name: "Commercial Real Estate Fund",
      assetType: "real_estate",
      totalValue: ethers.parseUnits("2000000", 6), // $2M USDY
      totalShares: 40000n,
      pricePerShare: ethers.parseUnits("50", 6), // $50 per share
      expectedYield: 750n // 7.5% APY
    },
    {
      name: "Art Collection Fund",
      assetType: "alternative",
      totalValue: ethers.parseUnits("300000", 6), // $300k USDY
      totalShares: 6000n,
      pricePerShare: ethers.parseUnits("50", 6), // $50 per share
      expectedYield: 1200n // 12% APY
    }
  ];

  console.log(`\n📋 Creating ${sampleAssets.length} sample RWA assets...\n`);

  for (let i = 0; i < sampleAssets.length; i++) {
    const asset = sampleAssets[i];
    
    try {
      console.log(`${i + 1}️⃣ Creating: ${asset.name}`);
      
      const tx = await marketplace.createAsset(
        asset.name,
        asset.assetType,
        asset.totalValue,
        asset.totalShares,
        asset.pricePerShare,
        asset.expectedYield
      );
      
      const receipt = await tx.wait();
      
      // Find the AssetCreated event
      const event = receipt.logs.find(log => {
        try {
          const parsed = marketplace.interface.parseLog(log);
          return parsed.name === 'AssetCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedEvent = marketplace.interface.parseLog(event);
        const assetId = parsedEvent.args.assetId;
        console.log(`   ✅ Asset ID: ${assetId} | ${asset.expectedYield / 100n}% APY`);
      } else {
        console.log(`   ✅ Created successfully`);
      }
      
    } catch (error) {
      console.error(`   ❌ Failed to create ${asset.name}:`, error.message);
    }
  }

  console.log("\n🎉 RWA Marketplace seeded successfully!");
  console.log("\n📊 Marketplace Summary:");
  console.log("=====================================");
  
  try {
    const totalAssets = await marketplace.totalAssetsCreated();
    console.log(`Total Assets Created: ${totalAssets}`);
    console.log(`Marketplace Address: ${deployment.contracts.RWAMarketplace}`);
    console.log(`Creator Address: ${deployer.address}`);
  } catch (error) {
    console.log("Could not fetch marketplace summary");
  }

  console.log("\n🚀 Ready to test the platform!");
  console.log("1. Open http://localhost:3000");
  console.log("2. Connect wallet to Mantle Sepolia Testnet");
  console.log("3. Navigate to Marketplace tab");
  console.log("4. Browse and purchase RWA shares!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });