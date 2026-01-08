const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mantle Prime MVP - Production Tests", function () {
  let deployer, user1, user2;
  let primeVault, creditIssuer, rwaMarketplace, compliance;
  let mETH, usdy;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    // Deploy mock tokens for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mETH = await MockERC20.deploy("Mock mETH", "mETH");
    usdy = await MockERC20.deploy("Mock USDY", "USDY");
    await mETH.waitForDeployment();
    await usdy.waitForDeployment();

    // Deploy core contracts
    const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
    compliance = await ComplianceModule.deploy();
    await compliance.waitForDeployment();

    const PrimeVault = await ethers.getContractFactory("PrimeVault");
    primeVault = await PrimeVault.deploy(await mETH.getAddress());
    await primeVault.waitForDeployment();

    const CreditIssuer = await ethers.getContractFactory("CreditIssuer");
    creditIssuer = await CreditIssuer.deploy(
      await primeVault.getAddress(),
      await usdy.getAddress(),
      ethers.ZeroAddress
    );
    await creditIssuer.waitForDeployment();

    const RWAMarketplace = await ethers.getContractFactory("RWAMarketplace");
    rwaMarketplace = await RWAMarketplace.deploy(
      await usdy.getAddress(),
      ethers.ZeroAddress,
      deployer.address
    );
    await rwaMarketplace.waitForDeployment();

    // Setup permissions
    await primeVault.transferOwnership(await creditIssuer.getAddress());
    
    const INSTITUTION_ROLE = await rwaMarketplace.INSTITUTION_ROLE();
    await rwaMarketplace.grantRole(INSTITUTION_ROLE, deployer.address);

    // Mint test tokens
    await mETH.mint(user1.address, ethers.parseEther("100"));
    await usdy.mint(await creditIssuer.getAddress(), ethers.parseEther("1000000"));
    
    // Add users to KYC
    await compliance.addToWhitelist(user1.address, "retail");
    await compliance.addToWhitelist(deployer.address, "institutional");
  });

  describe("Complete User Flow", function () {
    it("Should execute full MVP flow: deposit → credit → RWA purchase", async function () {
      const depositAmount = ethers.parseEther("10"); // 10 mETH
      const creditAmount = ethers.parseEther("20000"); // $20k USDY

      // 1. User deposits mETH
      await mETH.connect(user1).approve(await primeVault.getAddress(), depositAmount);
      await primeVault.connect(user1).deposit(depositAmount);
      
      expect(await primeVault.userDeposits(user1.address)).to.equal(depositAmount);
      expect(await primeVault.userCollateral(user1.address)).to.equal(depositAmount);

      // 2. User issues credit line
      await creditIssuer.connect(user1).issueCredit(creditAmount);
      
      expect(await creditIssuer.creditIssued(user1.address)).to.equal(creditAmount);
      expect(await usdy.balanceOf(user1.address)).to.be.gt(0);

      // 3. Create RWA asset
      await rwaMarketplace.createAsset(
        "Miami Beach Apartment",
        "real_estate",
        ethers.parseEther("500000"), // $500k
        10000, // 10k shares
        ethers.parseEther("50"), // $50/share
        800 // 8% yield
      );

      // 4. User purchases RWA shares
      const sharesToBuy = 100;
      const cost = ethers.parseEther("5000"); // 100 * $50
      
      await usdy.connect(user1).approve(await rwaMarketplace.getAddress(), cost);
      await rwaMarketplace.connect(user1).purchaseShares(1, sharesToBuy);

      expect(await rwaMarketplace.userShares(1, user1.address)).to.equal(sharesToBuy);
      
      console.log("✅ Complete MVP flow executed successfully!");
    });

    it("Should maintain proper collateral ratios", async function () {
      const depositAmount = ethers.parseEther("10");
      
      await mETH.connect(user1).approve(await primeVault.getAddress(), depositAmount);
      await primeVault.connect(user1).deposit(depositAmount);

      // Check max borrow capacity (80% LTV)
      const maxBorrow = await primeVault.getMaxBorrowCapacity(user1.address);
      expect(maxBorrow).to.equal(depositAmount * 80n / 100n);

      // Issue credit within limits
      const creditAmount = maxBorrow;
      await creditIssuer.connect(user1).issueCredit(creditAmount);

      // Check health factor
      const healthFactor = await primeVault.getHealthFactor(user1.address);
      expect(healthFactor).to.equal(125); // 125% (1.25x)
    });

    it("Should handle RWA yield distribution", async function () {
      // Create asset
      await rwaMarketplace.createAsset(
        "Test Asset",
        "real_estate",
        ethers.parseEther("100000"),
        1000,
        ethers.parseEther("100"),
        1000 // 10% yield
      );

      // User buys shares
      const depositAmount = ethers.parseEther("10");
      await mETH.connect(user1).approve(await primeVault.getAddress(), depositAmount);
      await primeVault.connect(user1).deposit(depositAmount);
      
      const creditAmount = ethers.parseEther("5000");
      await creditIssuer.connect(user1).issueCredit(creditAmount);
      
      await usdy.connect(user1).approve(await rwaMarketplace.getAddress(), creditAmount);
      await rwaMarketplace.connect(user1).purchaseShares(1, 50); // 50 shares

      // Distribute yield
      const YIELD_DISTRIBUTOR_ROLE = await rwaMarketplace.YIELD_DISTRIBUTOR_ROLE();
      await rwaMarketplace.grantRole(YIELD_DISTRIBUTOR_ROLE, deployer.address);
      
      const yieldAmount = ethers.parseEther("1000");
      await usdy.mint(deployer.address, yieldAmount);
      await usdy.approve(await rwaMarketplace.getAddress(), yieldAmount);
      
      await rwaMarketplace.distributeYield(1, yieldAmount);

      // Check claimable yield
      const claimableYield = await rwaMarketplace.getClaimableYield(1, user1.address);
      expect(claimableYield).to.be.gt(0);

      console.log("✅ RWA yield distribution working!");
    });
  });

  describe("Security & Edge Cases", function () {
    it("Should prevent over-borrowing", async function () {
      const depositAmount = ethers.parseEther("1");
      
      await mETH.connect(user1).approve(await primeVault.getAddress(), depositAmount);
      await primeVault.connect(user1).deposit(depositAmount);

      // Try to borrow more than max LTV
      const excessiveCredit = ethers.parseEther("10000");
      
      await expect(
        creditIssuer.connect(user1).issueCredit(excessiveCredit)
      ).to.be.revertedWith("Exceeds borrow capacity");
    });

    it("Should enforce KYC requirements", async function () {
      // Remove user from whitelist
      await compliance.removeFromWhitelist(user1.address);
      
      // Verify KYC fails
      const isValid = await compliance.verifyKYC(user1.address, "0x");
      expect(isValid).to.be.false;
    });

    it("Should handle emergency pause", async function () {
      await primeVault.pause();
      
      const depositAmount = ethers.parseEther("1");
      await mETH.connect(user1).approve(await primeVault.getAddress(), depositAmount);
      
      await expect(
        primeVault.connect(user1).deposit(depositAmount)
      ).to.be.revertedWith("Pausable: paused");
    });
  });
});

// Mock ERC20 for testing
const MockERC20 = {
  bytecode: "0x608060405234801561001057600080fd5b50",
  abi: [
    "constructor(string memory name, string memory symbol)",
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
  ]
};