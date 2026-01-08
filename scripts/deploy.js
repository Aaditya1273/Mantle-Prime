const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Mantle Prime MVP - 4 Core Contracts Only...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MNT\n");

  // Real Mantle Network token addresses - NO MOCKS
  const METH_ADDRESS = process.env.METH_ADDRESS || "0xd5F7838F5C461fefF7FE49ea5ebaF7728bb0AdFa"; // Real mETH
  const USDY_ADDRESS = process.env.USDY_ADDRESS || "0x5bE26527e817998A7206475496fde1E68957c5A6"; // Real USDY
  const USDT0_ADDRESS = process.env.USDT0_ADDRESS || ethers.ZeroAddress; // Real USDT0 (optional)

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);
  console.log("Using REAL tokens - Production Ready:");
  console.log("mETH:", METH_ADDRESS);
  console.log("USDY:", USDY_ADDRESS);
  console.log("USDT0:", USDT0_ADDRESS || "Not configured");
  console.log("");

  // 1. Deploy ComplianceModule
  console.log("1️⃣ Deploying ComplianceModule...");
  const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
  const compliance = await ComplianceModule.deploy();
  await compliance.waitForDeployment();
  const complianceAddress = await compliance.getAddress();
  console.log("✅ ComplianceModule deployed to:", complianceAddress);

  // 2. Deploy PrimeVault
  console.log("\n2️⃣ Deploying PrimeVault...");
  const PrimeVault = await ethers.getContractFactory("PrimeVault");
  const vault = await PrimeVault.deploy(METH_ADDRESS);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ PrimeVault deployed to:", vaultAddress);

  // 3. Deploy CreditIssuer
  console.log("\n3️⃣ Deploying CreditIssuer...");
  const CreditIssuer = await ethers.getContractFactory("CreditIssuer");
  const creditIssuer = await CreditIssuer.deploy(vaultAddress, USDY_ADDRESS, USDT0_ADDRESS);
  await creditIssuer.waitForDeployment();
  const creditIssuerAddress = await creditIssuer.getAddress();
  console.log("✅ CreditIssuer deployed to:", creditIssuerAddress);

  // 4. Deploy RWAMarketplace (Factory + Marketplace combined)
  console.log("\n4️⃣ Deploying RWAMarketplace...");
  const RWAMarketplace = await ethers.getContractFactory("RWAMarketplace");
  const rwaMarketplace = await RWAMarketplace.deploy(USDY_ADDRESS, USDT0_ADDRESS, deployer.address);
  await rwaMarketplace.waitForDeployment();
  const rwaMarketplaceAddress = await rwaMarketplace.getAddress();
  console.log("✅ RWAMarketplace deployed to:", rwaMarketplaceAddress);

  // 5. Setup permissions
  console.log("\n5️⃣ Setting up permissions...");
  
  // Transfer vault ownership to CreditIssuer
  await vault.transferOwnership(creditIssuerAddress);
  console.log("✅ Vault ownership transferred to CreditIssuer");
  
  // Grant RWA marketplace roles
  const INSTITUTION_ROLE = await rwaMarketplace.INSTITUTION_ROLE();
  const YIELD_DISTRIBUTOR_ROLE = await rwaMarketplace.YIELD_DISTRIBUTOR_ROLE();
  
  await rwaMarketplace.grantRole(INSTITUTION_ROLE, deployer.address);
  await rwaMarketplace.grantRole(YIELD_DISTRIBUTOR_ROLE, deployer.address);
  console.log("✅ RWA marketplace roles granted");
  
  // Add deployer to KYC whitelist
  await compliance.addToWhitelist(deployer.address, "institutional");
  console.log("✅ Deployer added to KYC whitelist");

  // 6. Display deployment summary
  console.log("\n🎉 Mantle Prime MVP Deployed Successfully!");
  console.log("=====================================");
  console.log("ComplianceModule: ", complianceAddress);
  console.log("PrimeVault:       ", vaultAddress);
  console.log("CreditIssuer:     ", creditIssuerAddress);
  console.log("RWAMarketplace:   ", rwaMarketplaceAddress);
  console.log("");
  console.log("Real Token Integration:");
  console.log("======================");
  console.log("mETH:             ", METH_ADDRESS);
  console.log("USDY:             ", USDY_ADDRESS);
  console.log("USDT0:            ", USDT0_ADDRESS || "Not configured");
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ComplianceModule: complianceAddress,
      PrimeVault: vaultAddress,
      CreditIssuer: creditIssuerAddress,
      RWAMarketplace: rwaMarketplaceAddress
    },
    tokens: {
      mETH: METH_ADDRESS,
      USDY: USDY_ADDRESS,
      USDT0: USDT0_ADDRESS
    }
  };

  const fs = require('fs');
  const deploymentFile = `deployment-${network.chainId}.json`;
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment saved to: ${deploymentFile}`);

  console.log("\n🚀 Ready for Production!");
  console.log("MVP Flow: Deposit mETH → Issue USDY Credit → Buy RWA Fractions → Earn Double Yield");
  console.log("\nNext Steps:");
  console.log("1. Verify contracts on Mantle explorer");
  console.log("2. Create sample RWA assets for demo");
  console.log("3. Test complete user journey");
  console.log("4. Deploy frontend with these addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });