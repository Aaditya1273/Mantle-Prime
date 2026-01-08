# 🏦 Mantle Prime: Institutional RWA Credit Marketplace

**Yield-Bearing Collateral for Compliant, Liquid Real-World Assets**

Mantle Prime is a modular, institutional-focused credit marketplace built natively on Mantle Network. It enables users to deposit **mETH** (Mantle's liquid staked ETH) as collateral to instantly mint over-collateralized credit lines in stable assets like **USDY**. These credit lines can then be used to purchase fractionalized Real-World Assets (RWAs) directly on the platform.

## 🎯 Core Innovation: Double Yield Composability

- **Deposited mETH** continues to earn ~4% native staking rewards
- **Purchased RWAs** generate their own real-world yields (rental income, interest, etc.)
- **Result**: Users earn double yield without selling their ETH position

This transforms RWAs from "buy-and-hold" static tokens into truly liquid, composable DeFi primitives while maintaining regulatory compatibility.

## 🏗️ Architecture

### Core Contracts

1. **MantlePrimeVault.sol** - Manages mETH deposits and collateral tracking
2. **CreditLine.sol** - Issues USDY/USDT0 credit lines against mETH collateral  
3. **RWAStore.sol** - Marketplace for fractional RWA trading (ERC1155)
4. **MantlePrime.sol** - Main orchestrator contract
5. **ZkKycStub.sol** - Compliance and KYC verification module

### Real Token Integration

- **mETH**: `0xd5F7838F5C461fefF7FE49ea5ebaF7728bb0AdFa` (Ethereum L1, bridged to Mantle)
- **USDY**: `0x5bE26527e817998A7206475496fde1E68957c5A6` (Mantle Network)
- **USDT0**: TBD (Optional additional stable credit token)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Mantle Network wallet with MNT for gas
- Real mETH and USDY tokens (no mocks/fakes)

### Installation

```bash
# Clone and setup
git clone <repository>
cd Mantle-Prime
npm install

# Configure environment
cp .env.example .env
# Add your PRIVATE_KEY and other settings
```

### Deployment

```bash
# Deploy to Mantle Sepolia Testnet
npm run deploy:testnet

# Deploy to Mantle Mainnet
npm run deploy:mainnet
```

## 💼 Business Model

1. **Origination Fee**: 0.3-0.5% when institutions tokenize new assets
2. **Yield Spread**: 8-15% performance fee on RWA yield distributions  
3. **Credit Facility Fee**: Small interest spread on credit lines
4. **Platform Fees**: 2.5% on RWA purchases, 10% on yield distributions

## 🔄 User Flow

### For Institutions
1. **Onboard** with KYC verification
2. **Tokenize Assets** (real estate, private debt, etc.)
3. **List on Marketplace** with yield expectations
4. **Distribute Yields** to fractional owners

### For Investors  
1. **Connect Wallet** and complete KYC
2. **Deposit mETH** as collateral (continues earning staking rewards)
3. **Issue Credit Line** in USDY (over-collateralized)
4. **Purchase RWA Fractions** using credit
5. **Earn Double Yield** (mETH staking + RWA yields)
6. **Trade/Transfer** RWA shares anytime

## 🛡️ Security & Compliance

- **Over-collateralization**: 150% collateral ratio required
- **Liquidation Protection**: 120% liquidation threshold
- **KYC/AML**: Integrated compliance module with ZK-proof capability
- **Access Controls**: Role-based permissions for institutions
- **Emergency Controls**: Pause functionality and admin overrides

## 📊 Risk Parameters

- **Max LTV**: 80% (Loan-to-Value ratio)
- **Collateral Ratio**: 150% (over-collateralized)
- **Liquidation Threshold**: 120%
- **Base Interest Rate**: 3% annual on credit lines
- **Platform Fees**: 2.5% purchase, 0.5% withdrawal

## 🌐 Mantle Network Integration

### Why Mantle for RWA?

- **Low Gas Fees**: Fractional investments cost cents, not dollars
- **High Scalability**: Handle institutional trading volumes
- **EVM Compatibility**: Standard Ethereum tooling and integrations
- **Security**: Inherits Ethereum's security through L2 architecture

### Network Configuration

```javascript
// Mantle Mainnet
{
  chainId: 5000,
  rpcUrl: "https://rpc.mantle.xyz",
  explorer: "https://explorer.mantle.xyz"
}

// Mantle Sepolia Testnet  
{
  chainId: 5003,
  rpcUrl: "https://rpc.sepolia.mantle.xyz",
  explorer: "https://sepolia.mantlescan.xyz"
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Test specific contract
npx hardhat test test/MantlePrimeVault.test.js
```

## 📋 Deployment Checklist

- [ ] Configure real token addresses in `.env`
- [ ] Deploy contracts to Mantle network
- [ ] Verify contracts on Mantle explorer
- [ ] Set up institutional KYC whitelist
- [ ] Configure RWA creator roles
- [ ] Test complete user flow
- [ ] Set up yield distribution mechanisms

## 🔮 Roadmap

### Phase 1: Core Platform (Current)
- ✅ Smart contract architecture
- ✅ mETH collateral integration
- ✅ USDY credit line system
- ✅ RWA marketplace (ERC1155)
- ✅ Basic compliance module

### Phase 2: Enhanced Features
- [ ] Advanced ZK-KYC integration
- [ ] Automated yield distribution
- [ ] Secondary market AMM
- [ ] Cross-chain RWA support
- [ ] Institutional dashboard

### Phase 3: Ecosystem Expansion
- [ ] Additional stable credit tokens
- [ ] Insurance modules
- [ ] Structured RWA products
- [ ] Governance token launch
- [ ] DAO transition

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Contact

- **Website**: [mantleprime.xyz](https://mantleprime.xyz)
- **Twitter**: [@MantlePrime](https://twitter.com/MantlePrime)
- **Discord**: [Join Community](https://discord.gg/mantleprime)
- **Email**: team@mantleprime.xyz

---

**Mantle Prime**: Bridging Traditional Finance and DeFi through Institutional-Grade RWA Credit Markets on Mantle Network 🚀