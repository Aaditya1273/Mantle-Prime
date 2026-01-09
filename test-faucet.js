const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing MockUSDY Faucet...");

  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  // Contract address from deployment
  const mockUSDYAddress = "0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9";
  
  try {
    // Get contract instance
    const MockUSDY = await ethers.getContractFactory("MockUSDY");
    const mockUSDY = MockUSDY.attach(mockUSDYAddress);

    // Check current balance
    const currentBalance = await mockUSDY.balanceOf(deployer.address);
    console.log("Current USDY balance:", ethers.formatEther(currentBalance));

    // Check if balance is less than 10,000 USDY
    const maxBalance = ethers.parseEther("10000");
    if (currentBalance >= maxBalance) {
      console.log("❌ Already have maximum USDY balance (10,000+)");
      console.log("💡 This is why the faucet is failing!");
      return;
    }

    // Try to call faucet
    console.log("Calling faucet...");
    const tx = await mockUSDY.faucet();
    console.log("Transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Faucet successful! Gas used:", receipt.gasUsed.toString());

    // Check new balance
    const newBalance = await mockUSDY.balanceOf(deployer.address);
    console.log("New USDY balance:", ethers.formatEther(newBalance));

  } catch (error) {
    console.error("❌ Faucet test failed:", error.message);
    
    if (error.message.includes("Already have enough USDY")) {
      console.log("💡 User already has maximum USDY balance");
    } else if (error.message.includes("call revert exception")) {
      console.log("💡 Contract call reverted - check contract address and network");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });