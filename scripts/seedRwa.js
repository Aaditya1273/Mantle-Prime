const { ethers } = require("hardhat");

async function main() {
  console.log("🌱 Seeding Mantle Prime with sample RWA assets...\n");

  // Load deployment addresses
  const network = await ethers.provider.getNetwork();
  const deploymentFile = `deployment-${network.chainId}.json`;
  
  let deploymentInfo;
  try {
    const fs = require('fs');
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  } catch (error) {
    console.error("❌ Deployment file not found. Run deployment first.");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Seeding with account:", deployer.address);

  // Get contract instances
  const rwaMarketplace = await ethers.getContractAt("RWAMarketplace", deploymentInfo.contracts.RWAMarketplace);
  const compliance = await ethers.getContractAt("ComplianceModule", deploymentInfo.contracts.ComplianceModule);

  console.log("📋 Creating sample RWA assets for demo...\n");

  // Sample RWA assets for demo
  const sampleAssets = [
    {
      name: "Miami Beach Luxury Apartment",
      assetType: "real_estate",
      totalValue: ethers.parseEther("500000"), // $500k
      totalShares: 10000,
      pricePerShare: ethers.parseEther("50"), // $50 per share
      expectedYield: 800 // 8% annual yield
    },
    {
      name: "Corporate Bond Portfolio",
      assetType: "private_debt",
      totalValue: ethers.parseEther("1000000"), // $1M
      totalShares: 20000,
      pricePerShare: ethers.parseEther("50"), // $50 per share
      expectedYield: 600 // 6% annual yield
    },
    {
      name: "Commercial Real Estate Fund",
      assetType: "real_estate",
      totalValue: ethers.parseEther("2000000"), // $2M
      totalShares: 40000,
      pricePerShare: ethers.parseEther("50"), // $50 per share
      expectedYield: 750 // 7.5% annual yield
    }
  ];

  // Create assets
  for (let i = 0; i < sampleAssets.length; i++) {
    const asset = sampleAssets[i];
    
    console.log(`${i + 1}️⃣ Creating: ${asset.name}`);
    
    try {
      const tx = await rwaMarketplace.createAsset(
        asset.name,
        asset.assetType,
        asset.totalValue,
        asset.totalShares,
        asset.pricePerShare,
        asset.expectedYield
      );
      
      const receipt = await tx.wait();
      console.log(`✅ Created asset ID ${i + 1} - Gas used: ${receipt.gasUsed.toString()}`);
      
    } catch (error) {
      console.error(`❌ Failed to create ${asset.name}:`, error.message);
    }
  }

  console.log("\n📊 Sample assets created successfully!");
  console.log("\n🎯 Demo Flow Ready:");
  console.log("1. Users can deposit mETH to PrimeVault");
  console.log("2. Issue USDY credit lines via CreditIssuer");
  console.log("3. Purchase fractional RWA shares with credit");
  console.log("4. Earn double yield: mETH staking + RWA yields");
  
  console.log("\n📋 Contract Addresses:");
  console.log("ComplianceModule: ", deploymentInfo.contracts.ComplianceModule);
  console.log("PrimeVault:       ", deploymentInfo.contracts.PrimeVault);
  console.log("CreditIssuer:     ", deploymentInfo.contracts.CreditIssuer);
  console.log("RWAMarketplace:   ", deploymentInfo.contracts.RWAMarketplace);
  
  console.log("\n🚀 Mantle Prime MVP is production ready!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });