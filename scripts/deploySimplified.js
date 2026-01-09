const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Simplified Mantle Prime with Native MNT...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MNT\n");

  // 1. Deploy MantleStakingVault (uses native MNT)
  console.log("📦 Deploying MantleStakingVault...");
  
  const MantleStakingVault = await ethers.getContractFactory("MantleStakingVault");
  const mantleVault = await MantleStakingVault.deploy();
  await mantleVault.waitForDeployment();
  console.log("✅ MantleStakingVault deployed to:", await mantleVault.getAddress());

  // 2. Deploy MockUSDY for credit system
  console.log("\n📦 Deploying MockUSDY for credit...");
  
  const MockUSDY = await ethers.getContractFactory("MockUSDY");
  const mockUSDY = await MockUSDY.deploy();
  await mockUSDY.waitForDeployment();
  console.log("✅ MockUSDY deployed to:", await mockUSDY.getAddress());

  // 3. Deploy ComplianceModule
  console.log("\n📦 Deploying ComplianceModule...");
  
  const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
  const complianceModule = await ComplianceModule.deploy();
  await complianceModule.waitForDeployment();
  console.log("✅ ComplianceModule deployed to:", await complianceModule.getAddress());

  // 4. Deploy RWAMarketplace
  console.log("\n📦 Deploying RWAMarketplace...");
  
  const RWAMarketplace = await ethers.getContractFactory("RWAMarketplace");
  const rwaMarketplace = await RWAMarketplace.deploy(
    await mockUSDY.getAddress(),
    ethers.ZeroAddress, // No USDT for simplified version
    deployer.address    // Admin address
  );
  await rwaMarketplace.waitForDeployment();
  console.log("✅ RWAMarketplace deployed to:", await rwaMarketplace.getAddress());

  // 5. Setup permissions
  console.log("\n🔧 Setting up permissions...");

  // Whitelist deployer for testing
  await complianceModule.addToWhitelist(deployer.address, "institutional");
  console.log("✅ Deployer added to compliance whitelist");

  // Grant INSTITUTION_ROLE to deployer for creating assets
  const INSTITUTION_ROLE = ethers.keccak256(ethers.toUtf8Bytes("INSTITUTION_ROLE"));
  await rwaMarketplace.grantRole(INSTITUTION_ROLE, deployer.address);
  console.log("✅ Deployer granted INSTITUTION_ROLE");

  // 6. Fund yield pool for MantleStakingVault
  console.log("\n💰 Funding yield pool...");
  
  // Send 10 MNT to vault for yield payments
  await mantleVault.fundYieldPool({ value: ethers.parseEther("10") });
  console.log("✅ Funded vault with 10 MNT for yield payments");

  // 7. Create sample RWA assets
  console.log("\n🎭 Creating sample RWA assets...");

  const assets = [
    {
      name: "Miami Beach Luxury Apartment",
      assetType: "real_estate",
      totalShares: 10000,
      pricePerShare: ethers.parseEther("50"), // 50 USDY per share
      expectedYield: 800, // 8.00% APY
    },
    {
      name: "Corporate Bond Portfolio", 
      assetType: "private_debt",
      totalShares: 20000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 650, // 6.50% APY
    },
    {
      name: "Renewable Energy Project",
      assetType: "infrastructure",
      totalShares: 15000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 920, // 9.20% APY
    },
    {
      name: "Commercial Real Estate Fund",
      assetType: "real_estate",
      totalShares: 40000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 750, // 7.50% APY
    },
    {
      name: "Art Collection Fund",
      assetType: "alternative",
      totalShares: 6000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 1200, // 12.00% APY
    }
  ];

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const totalValue = BigInt(asset.totalShares) * asset.pricePerShare;
    
    await rwaMarketplace.createAsset(
      asset.name,
      asset.assetType,
      totalValue,
      asset.totalShares,
      asset.pricePerShare,
      asset.expectedYield
    );
    console.log(`✅ Created RWA asset: ${asset.name}`);
  }

  // 8. Give deployer some MockUSDY for testing
  console.log("\n💰 Minting demo tokens...");
  
  // First add deployer as authorized minter
  await mockUSDY.addAuthorizedMinter(deployer.address);
  console.log("✅ Deployer added as authorized minter");
  
  await mockUSDY.mint(deployer.address, ethers.parseEther("10000"));
  console.log("✅ Minted 10,000 MockUSDY for deployer");

  // 9. Save deployment info
  const deploymentInfo = {
    network: "mantle-sepolia-testnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    approach: "simplified-native-mnt",
    contracts: {
      MantleStakingVault: await mantleVault.getAddress(),
      MockUSDY: await mockUSDY.getAddress(),
      ComplianceModule: await complianceModule.getAddress(),
      RWAMarketplace: await rwaMarketplace.getAddress()
    },
    demoSetup: {
      rwaAssetsCreated: assets.length,
      vaultYieldPool: "10 MNT",
      deployerMockUSDY: "10000",
      whitelistedUsers: [deployer.address]
    },
    userFlow: {
      step1: "User stakes MNT in MantleStakingVault to earn 4.2% APY",
      step2: "User gets MockUSDY from faucet (simulates credit line)",
      step3: "User invests USDY in RWA assets (8-12% APY)",
      step4: "User earns double yield: MNT staking + RWA returns"
    }
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-simplified.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n🎉 Simplified Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("MantleStakingVault:", await mantleVault.getAddress());
  console.log("MockUSDY:", await mockUSDY.getAddress());
  console.log("ComplianceModule:", await complianceModule.getAddress());
  console.log("RWAMarketplace:", await rwaMarketplace.getAddress());

  console.log("\n🎭 Simplified Demo Flow:");
  console.log("1. Users stake native MNT → earn 4.2% APY");
  console.log("2. Users get USDY from faucet → simulates credit system");
  console.log("3. Users invest USDY in RWAs → earn 8-12% APY");
  console.log("4. Users earn double yield from both sources");

  console.log("\n💡 Key Benefits:");
  console.log("- Uses native MNT token (no external dependencies)");
  console.log("- Real staking mechanics with yield calculation");
  console.log("- Simplified for hackathon demo");
  console.log("- Still demonstrates core value proposition");

  console.log("\n🚀 Ready for hackathon demo!");
  console.log("\nUser Instructions:");
  console.log("1. Stake MNT: mantleVault.stake() with MNT value");
  console.log("2. Get USDY: mockUSDY.faucet() for 5,000 USDY");
  console.log("3. Buy RWA: rwaMarketplace.purchaseShares(assetId, shares)");
  console.log("4. Claim yields: mantleVault.claimYield() + rwaMarketplace.claimYield()");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });