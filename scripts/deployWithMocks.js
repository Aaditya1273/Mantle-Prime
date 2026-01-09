const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Mantle Prime with Mock Tokens for Hackathon Demo...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  // 1. Deploy Mock Tokens First
  console.log("📦 Deploying Mock Tokens...");
  
  // Deploy MockMETH
  const MockMETH = await ethers.getContractFactory("MockMETH");
  const mockMETH = await MockMETH.deploy();
  await mockMETH.waitForDeployment();
  console.log("✅ MockMETH deployed to:", await mockMETH.getAddress());

  // Deploy MockUSDY
  const MockUSDY = await ethers.getContractFactory("MockUSDY");
  const mockUSDY = await MockUSDY.deploy();
  await mockUSDY.waitForDeployment();
  console.log("✅ MockUSDY deployed to:", await mockUSDY.getAddress());

  // 2. Deploy Core Contracts
  console.log("\n📦 Deploying Core Contracts...");

  // Deploy ComplianceModule
  const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
  const complianceModule = await ComplianceModule.deploy();
  await complianceModule.waitForDeployment();
  console.log("✅ ComplianceModule deployed to:", await complianceModule.getAddress());

  // Deploy PrimeVault with MockMETH
  const PrimeVault = await ethers.getContractFactory("PrimeVault");
  const primeVault = await PrimeVault.deploy(await mockMETH.getAddress());
  await primeVault.waitForDeployment();
  console.log("✅ PrimeVault deployed to:", await primeVault.getAddress());

  // Deploy CreditIssuer with MockUSDY
  const CreditIssuer = await ethers.getContractFactory("CreditIssuer");
  const creditIssuer = await CreditIssuer.deploy(
    await primeVault.getAddress(),
    await mockUSDY.getAddress(),
    await complianceModule.getAddress()
  );
  await creditIssuer.waitForDeployment();
  console.log("✅ CreditIssuer deployed to:", await creditIssuer.getAddress());

  // Deploy RWAMarketplace
  const RWAMarketplace = await ethers.getContractFactory("RWAMarketplace");
  const rwaMarketplace = await RWAMarketplace.deploy(
    await mockUSDY.getAddress(),
    await complianceModule.getAddress()
  );
  await rwaMarketplace.waitForDeployment();
  console.log("✅ RWAMarketplace deployed to:", await rwaMarketplace.getAddress());

  // 3. Setup Permissions and Integrations
  console.log("\n🔧 Setting up permissions and integrations...");

  // Add CreditIssuer as authorized minter for MockUSDY
  await mockUSDY.addAuthorizedMinter(await creditIssuer.getAddress());
  console.log("✅ CreditIssuer authorized to mint USDY");

  // Whitelist deployer for testing
  await complianceModule.addToWhitelist(deployer.address);
  console.log("✅ Deployer added to compliance whitelist");

  // 4. Setup Demo Data
  console.log("\n🎭 Setting up demo data...");

  // Create sample RWA assets
  const assets = [
    {
      name: "Miami Beach Luxury Apartment",
      totalShares: 10000,
      pricePerShare: ethers.parseEther("50"), // 50 USDY per share
      expectedYield: 800, // 8.00% APY
      riskLevel: 1 // Medium risk
    },
    {
      name: "Corporate Bond Portfolio", 
      totalShares: 20000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 650, // 6.50% APY
      riskLevel: 0 // Low risk
    },
    {
      name: "Renewable Energy Project",
      totalShares: 15000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 920, // 9.20% APY
      riskLevel: 1 // Medium risk
    },
    {
      name: "Commercial Real Estate Fund",
      totalShares: 40000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 750, // 7.50% APY
      riskLevel: 0 // Low risk
    },
    {
      name: "Art Collection Fund",
      totalShares: 6000,
      pricePerShare: ethers.parseEther("50"),
      expectedYield: 1200, // 12.00% APY
      riskLevel: 2 // High risk
    }
  ];

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    await rwaMarketplace.createAsset(
      asset.name,
      asset.totalShares,
      asset.pricePerShare,
      asset.expectedYield,
      asset.riskLevel
    );
    console.log(`✅ Created RWA asset: ${asset.name}`);
  }

  // 5. Fund deployer with demo tokens
  console.log("\n💰 Funding deployer with demo tokens...");
  
  // Give deployer some MockMETH for testing
  await mockMETH.mintForDemo(deployer.address, ethers.parseEther("100"));
  console.log("✅ Minted 100 MockMETH for deployer");

  // Give deployer some MockUSDY for testing
  await mockUSDY.mint(deployer.address, ethers.parseEther("10000"));
  console.log("✅ Minted 10,000 MockUSDY for deployer");

  // 6. Save deployment info
  const deploymentInfo = {
    network: "mantle-sepolia-testnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MockMETH: await mockMETH.getAddress(),
      MockUSDY: await mockUSDY.getAddress(),
      ComplianceModule: await complianceModule.getAddress(),
      PrimeVault: await primeVault.getAddress(),
      CreditIssuer: await creditIssuer.getAddress(),
      RWAMarketplace: await rwaMarketplace.getAddress()
    },
    demoSetup: {
      rwaAssetsCreated: assets.length,
      deployerMockMETH: "100",
      deployerMockUSDY: "10000",
      whitelistedUsers: [deployer.address]
    }
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-with-mocks.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("MockMETH:", await mockMETH.getAddress());
  console.log("MockUSDY:", await mockUSDY.getAddress());
  console.log("ComplianceModule:", await complianceModule.getAddress());
  console.log("PrimeVault:", await primeVault.getAddress());
  console.log("CreditIssuer:", await creditIssuer.getAddress());
  console.log("RWAMarketplace:", await rwaMarketplace.getAddress());

  console.log("\n🎭 Demo Setup Complete:");
  console.log("- 5 RWA assets created in marketplace");
  console.log("- Deployer has 100 MockMETH and 10,000 MockUSDY");
  console.log("- Deployer is whitelisted for compliance");
  console.log("- MockUSDY earns 4.5% APY automatically");
  console.log("- MockMETH earns 4.2% APY when staked");

  console.log("\n🚀 Ready for hackathon demo!");
  console.log("\nFor users to get tokens:");
  console.log("1. Call mockMETH.faucet() to get 50 mETH");
  console.log("2. Call mockUSDY.faucet() to get 5,000 USDY");
  console.log("3. Admin can whitelist users via complianceModule.addToWhitelist()");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });