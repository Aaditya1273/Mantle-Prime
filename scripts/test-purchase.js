const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing RWA Purchase Flow on Mantle Sepolia...\n");

  try {
    // Get signer
    const [buyer] = await ethers.getSigners();
    console.log(`👤 Buyer address: ${buyer.address}`);
    
    // Get balance
    const balance = await ethers.provider.getBalance(buyer.address);
    console.log(`💰 MNT balance: ${ethers.formatEther(balance)} MNT`);

    // Contract addresses
    const marketplaceAddress = "0x101190D8AcF4b5D4C01b60BFFc222FD3FD6E64a2";
    const mockUSDYAddress = "0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9";
    
    console.log(`🏪 Marketplace: ${marketplaceAddress}`);
    console.log(`🪙 Mock USDY: ${mockUSDYAddress}\n`);

    // Contract ABIs
    const marketplaceABI = [
      "function getAssetInfo(uint256 assetId) external view returns (string memory name, uint256 totalShares, uint256 availableShares, uint256 pricePerShare, uint256 expectedYield)",
      "function purchaseShares(uint256 assetId, uint256 shares) external",
      "function getUserShares(address user, uint256 assetId) external view returns (uint256)"
    ];

    const usdyABI = [
      "function balanceOf(address account) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function faucet() external"
    ];

    // Connect to contracts
    const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, buyer);
    const usdy = new ethers.Contract(mockUSDYAddress, usdyABI, buyer);

    // Check USDY balance
    const usdyBalance = await usdy.balanceOf(buyer.address);
    console.log(`💵 Current USDY balance: ${ethers.formatEther(usdyBalance)} USDY`);

    // Get tokens from faucet if needed
    if (usdyBalance < ethers.parseEther("100")) {
      console.log("🚰 Getting USDY from faucet...");
      const faucetTx = await usdy.faucet();
      await faucetTx.wait();
      
      const newBalance = await usdy.balanceOf(buyer.address);
      console.log(`✅ New USDY balance: ${ethers.formatEther(newBalance)} USDY`);
    }

    // Check asset info (Asset 0 - Miami Beach Luxury Apartment)
    const assetId = 0;
    const assetInfo = await marketplace.getAssetInfo(assetId);
    console.log(`\n🏢 Asset ${assetId}: ${assetInfo[0]}`);
    console.log(`   💰 Price per share: ${ethers.formatEther(assetInfo[3])} USDY`);
    console.log(`   🛒 Available shares: ${assetInfo[2].toString()}`);

    // Approve marketplace to spend USDY
    const sharesToBuy = 1;
    const totalCost = BigInt(sharesToBuy) * assetInfo[3];
    
    console.log(`\n💳 Approving ${ethers.formatEther(totalCost)} USDY for marketplace...`);
    const approveTx = await usdy.approve(marketplaceAddress, totalCost);
    await approveTx.wait();
    console.log("✅ Approval confirmed");

    // Purchase shares
    console.log(`\n🛒 Purchasing ${sharesToBuy} share(s) of ${assetInfo[0]}...`);
    const purchaseTx = await marketplace.purchaseShares(assetId, sharesToBuy);
    console.log(`📝 Transaction hash: ${purchaseTx.hash}`);
    
    const receipt = await purchaseTx.wait();
    console.log(`✅ Purchase confirmed in block: ${receipt.blockNumber}`);

    // Verify purchase
    const userShares = await marketplace.getUserShares(buyer.address, assetId);
    console.log(`\n🎯 Verification:`);
    console.log(`   👤 Your shares in Asset ${assetId}: ${userShares.toString()}`);
    
    const finalBalance = await usdy.balanceOf(buyer.address);
    console.log(`   💵 Remaining USDY balance: ${ethers.formatEther(finalBalance)} USDY`);

    console.log("\n🎉 RWA Purchase Test Completed Successfully!");
    console.log(`🌐 View transaction: https://sepolia.mantlescan.xyz/tx/${purchaseTx.hash}`);

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });