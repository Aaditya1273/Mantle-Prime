const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Testing Mantle Sepolia connection...");
    
    // Test network connection
    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId);
    
    // Test signers
    const signers = await ethers.getSigners();
    console.log("Number of signers:", signers.length);
    
    if (signers.length > 0) {
      const deployer = signers[0];
      console.log("Deployer address:", deployer.address);
      
      // Test balance
      const balance = await deployer.provider.getBalance(deployer.address);
      console.log("Balance:", ethers.formatEther(balance), "MNT");
    } else {
      console.log("❌ No signers found - check PRIVATE_KEY in .env");
    }
    
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });