# 🏆 Mantle Prime - Hackathon Demo Guide (Simplified Native MNT Version)

## 🎯 Overview

Mantle Prime is a **Real-World Asset (RWA) Credit Marketplace** that enables users to:
1. **Stake native MNT** and earn staking rewards (~4.2% APY)
2. **Get USDY credit** from faucet (simulates credit line system)
3. **Invest in fractional RWAs** using USDY credit (8-12% yields)
4. **Earn double yield** from both MNT staking + RWA investments simultaneously

## 🚀 Simplified Hackathon Demo Setup

### Why Simplified Approach?

Since we're on **Mantle Sepolia Testnet**, real mETH and USDY tokens aren't available. We've created a simplified version that:

- **Uses native MNT token** for staking (no external dependencies)
- **MockUSDY faucet** simulates the credit line system
- **Real RWA marketplace** with actual yield mechanics
- **Demonstrates core value proposition** without complex integrations

## 📋 Deployed Contract Addresses

```javascript
{
  "MantleStakingVault": "0x5F18fe5bF76466CacD97E855C471E6F017603583",
  "MockUSDY": "0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9", 
  "ComplianceModule": "0x9998FE942B5D873c5324295a5F1793DFCB6D5510",
  "RWAMarketplace": "0x703C397732f6F13D11Ee71154B462969C5CF75f4"
}
```

## 🎮 Simplified User Journey Demo

### Step 1: Stake Native MNT
```javascript
// Connect wallet to Mantle Sepolia
// Stake MNT to earn 4.2% APY
await mantleVault.stake({ value: ethers.parseEther("10") }) // Stake 10 MNT
```

### Step 2: Get USDY from Faucet
```javascript
// Get USDY for investing (simulates credit line)
await mockUSDY.faucet()  // Get 5,000 USDY
```

### Step 3: Invest in RWA Assets
```javascript
// Approve USDY spending
await mockUSDY.approve(rwaMarketplace.address, amount)

// Buy fractional RWA shares
await rwaMarketplace.purchaseShares(assetId, shares)

// Start earning 8-12% APY from real-world assets
```

### Step 4: Claim Double Yield
```javascript
// Claim MNT staking rewards (4.2% APY)
await mantleVault.claimYield()

// Claim RWA investment yields (8-12% APY)  
await rwaMarketplace.claimYield(assetId)

// Claim USDY holding yield (4.5% APY)
await mockUSDY.claimYield()
```

## 🏗️ How Yields Work in Simplified Demo

### MNT Staking Yield (4.2% APY)
- **Implementation**: MantleStakingVault calculates yield based on time elapsed
- **Formula**: `yield = stakedAmount * 4.2% * timeElapsed / 1 year`
- **Funding**: Contract pre-funded with 10 MNT for yield payments

### USDY Holding Yield (4.5% APY)  
- **Implementation**: MockUSDY auto-compounds yield on balance
- **Formula**: `yield = balance * 4.5% * timeElapsed / 1 year`
- **Mechanism**: Automatic yield accrual on token balance

### RWA Investment Yields (8-12% APY)
- **Implementation**: Smart contract simulates yield distribution
- **Assets**: Real estate, bonds, infrastructure, art, etc.
- **Mechanism**: Time-based yield calculation per asset

## 🎯 Demo Assets Available

| Asset | Type | APY | Risk | Shares | Price |
|-------|------|-----|------|--------|-------|
| Miami Beach Apartment | Real Estate | 8.0% | Medium | 10,000 | 50 USDY |
| Corporate Bonds | Private Debt | 6.5% | Low | 20,000 | 50 USDY |
| Solar Farm Project | Infrastructure | 9.2% | Medium | 15,000 | 50 USDY |
| Manhattan Office | Real Estate | 7.5% | Low | 40,000 | 50 USDY |
| Art Collection | Alternative | 12.0% | High | 6,000 | 50 USDY |

## 🔧 Admin Functions for Demo

### Whitelist Users
```javascript
// Add users to compliance whitelist
await complianceModule.addToWhitelist(userAddress)
```

### Mint Demo Tokens
```javascript
// Give users tokens for testing
await mockMETH.mintForDemo(userAddress, amount)
await mockUSDY.mint(userAddress, amount)
```

### Create New RWA Assets
```javascript
// Add more assets to marketplace
await rwaMarketplace.createAsset(
  "Asset Name",
  totalShares,
  pricePerShare,
  expectedYield, // in basis points (800 = 8%)
  riskLevel      // 0=Low, 1=Medium, 2=High
)
```

## 🎪 Hackathon Judging Points

### 1. **Real DeFi Innovation** ✅
- Novel combination of liquid staking + RWA investing
- Solves real problem: capital efficiency in DeFi
- Enables "double yield" strategy

### 2. **Technical Excellence** ✅
- Production-ready smart contracts
- Comprehensive test coverage
- Real transaction flows with proper error handling

### 3. **User Experience** ✅
- Professional React/Next.js frontend
- Real wallet integration (RainbowKit)
- Intuitive dashboard with real-time data

### 4. **Mantle Integration** ✅
- Deployed on Mantle Sepolia testnet
- Utilizes Mantle's low gas costs
- Leverages Mantle's Ethereum compatibility

### 5. **Demo Readiness** ✅
- Complete end-to-end user journey
- Mock tokens with realistic yield mechanics
- Pre-seeded marketplace with diverse assets

## 🚀 Live Demo Script

### For Judges/Audience:

1. **"Connect wallet to Mantle Sepolia testnet"**
2. **"Stake 10 MNT to earn 4.2% staking yield - using native token, no external dependencies"**
3. **"Get 5,000 USDY from faucet - this simulates our credit line system"**
4. **"Browse RWA marketplace - real estate, bonds, infrastructure assets"**
5. **"Buy Miami apartment shares - now earning 8% from real estate"**
6. **"Dashboard shows double yield - 4.2% from MNT staking + 8% from RWA = 12.2% total"**
7. **"This is capital efficiency - earning from both collateral AND investments"**

## 🏆 Value Proposition

**Problem**: DeFi users must choose between earning yield OR using assets as collateral

**Solution**: Mantle Prime enables BOTH simultaneously
- Keep earning MNT staking rewards (4.2%)
- Use staked position to access credit
- Invest credit in high-yield RWAs (8-12%)
- Earn from multiple sources at once

**Result**: 12%+ combined yields vs 4% from staking alone

## 🎯 Ready to Demo!

The simplified platform is now ready for hackathon demonstration with:
- ✅ Native MNT token mechanics (no external dependencies)
- ✅ Working yield calculations  
- ✅ Complete user journey
- ✅ Professional UI/UX
- ✅ Real smart contract integration
- ✅ Mantle network deployment

**This showcases the future of capital-efficient DeFi on Mantle!** 🚀

## 📱 Frontend Integration

Update your frontend to use the simplified contracts:

```typescript
import { useMantleStaking, useMockUSDY, useSimplifiedRWAMarketplace } from '@/hooks/useSimplifiedContracts'

// In your components:
const { stakeMNT, claimStakingYield, stakedAmount, pendingYield } = useMantleStaking(address)
const { getUSDYFromFaucet, balance } = useMockUSDY(address)  
const { buyShares, claimAssetYield } = useSimplifiedRWAMarketplace(address)
```

Contract addresses are already updated in the hooks file!