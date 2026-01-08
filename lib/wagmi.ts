import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mantle, mantleTestnet } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Mantle Prime',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [mantle, mantleTestnet],
  ssr: true,
})

// Contract addresses (deployed on Mantle Sepolia Testnet)
export const CONTRACTS = {
  PrimeVault: process.env.NEXT_PUBLIC_PRIME_VAULT_ADDRESS || '0xEa53E2fF08CD18fD31B188a72079aE9Ca34856e4',
  CreditIssuer: process.env.NEXT_PUBLIC_CREDIT_ISSUER_ADDRESS || '0x464D37393C8D3991b493DBb57F5f3b8c31c7Fa60',
  RWAMarketplace: process.env.NEXT_PUBLIC_RWA_MARKETPLACE_ADDRESS || '0xcf4F105FeAc23F00489a7De060D34959f8796dd0',
  ComplianceModule: process.env.NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS || '0xa31749b81470eD13C5efeAa290Cf1caB67Aeb425',
} as const

export const TOKENS = {
  mETH: process.env.NEXT_PUBLIC_METH_ADDRESS || '0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa', // Real mETH
  USDY: process.env.NEXT_PUBLIC_USDY_ADDRESS || '0x5be26527e817998a7206475496fde1e68957c5a6', // Real USDY
} as const

// Contract ABIs (simplified for key functions)
export const PRIME_VAULT_ABI = [
  'function deposit(uint256 amount) external',
  'function withdraw(uint256 amount) external',
  'function userDeposits(address user) external view returns (uint256)',
  'function userCollateral(address user) external view returns (uint256)',
  'function creditUsed(address user) external view returns (uint256)',
  'function getMaxBorrowCapacity(address user) external view returns (uint256)',
  'function getHealthFactor(address user) external view returns (uint256)',
  'event Deposited(address indexed user, uint256 amount)',
  'event Withdrawn(address indexed user, uint256 amount)',
] as const

export const CREDIT_ISSUER_ABI = [
  'function issueCredit(uint256 amount) external',
  'function repayCredit(uint256 amount) external',
  'function creditIssued(address user) external view returns (uint256)',
  'function getTotalDebt(address user) external view returns (uint256)',
  'event CreditIssued(address indexed user, uint256 amount, uint256 fee)',
  'event CreditRepaid(address indexed user, uint256 amount, uint256 interest)',
] as const

export const RWA_MARKETPLACE_ABI = [
  'function createAsset(string memory name, string memory assetType, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, uint256 expectedYield) external returns (uint256)',
  'function purchaseShares(uint256 assetId, uint256 shares) external',
  'function claimYield(uint256 assetId) external',
  'function getAsset(uint256 assetId) external view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalShares, uint256 availableShares, uint256 pricePerShare, uint256 expectedYield, address creator, bool isActive, uint256 createdAt))',
  'function getUserAssets(address user) external view returns (uint256[] memory)',
  'function userShares(uint256 assetId, address user) external view returns (uint256)',
  'function getClaimableYield(uint256 assetId, address user) external view returns (uint256)',
  'event AssetCreated(uint256 indexed assetId, string name, address indexed creator, uint256 totalValue)',
  'event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 cost)',
  'event YieldClaimed(uint256 indexed assetId, address indexed user, uint256 amount)',
] as const

export const ERC20_ABI = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const