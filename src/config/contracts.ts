// Contract addresses and ABIs for Mantle Prime

export const CONTRACT_ADDRESSES = {
  5003: { // Mantle Sepolia Testnet
    ComplianceModule: process.env.NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS || '',
    PrimeVault: process.env.NEXT_PUBLIC_PRIME_VAULT_ADDRESS || '',
    CreditIssuer: process.env.NEXT_PUBLIC_CREDIT_ISSUER_ADDRESS || '',
    RWAMarketplace: process.env.NEXT_PUBLIC_RWA_MARKETPLACE_ADDRESS || '',
    mETH: process.env.NEXT_PUBLIC_METH_ADDRESS || '0xd5F7838F5C461fefF7FE49ea5ebaF7728bb0AdFa',
    USDY: process.env.NEXT_PUBLIC_USDY_ADDRESS || '0x5bE26527e817998A7206475496fde1E68957c5A6',
  },
  5000: { // Mantle Mainnet
    ComplianceModule: '',
    PrimeVault: '',
    CreditIssuer: '',
    RWAMarketplace: '',
    mETH: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bb0AdFa',
    USDY: '0x5bE26527e817998A7206475496fde1E68957c5A6',
  }
} as const;

// Essential ABIs for contract interactions
export const PRIME_VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function userDeposits(address user) view returns (uint256)",
  "function userCollateral(address user) view returns (uint256)",
  "function creditUsed(address user) view returns (uint256)",
  "function getAvailableCollateral(address user) view returns (uint256)",
  "function getMaxBorrowCapacity(address user) view returns (uint256)",
  "function getHealthFactor(address user) view returns (uint256)",
  "event Deposited(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)"
] as const;

export const CREDIT_ISSUER_ABI = [
  "function issueCredit(uint256 amount) external",
  "function repayCredit(uint256 amount) external",
  "function creditIssued(address user) view returns (uint256)",
  "function interestAccrued(address user) view returns (uint256)",
  "function getTotalDebt(address user) view returns (uint256)",
  "function updateInterest(address user) external",
  "event CreditIssued(address indexed user, uint256 amount, uint256 fee)",
  "event CreditRepaid(address indexed user, uint256 amount, uint256 interest)"
] as const;

export const RWA_MARKETPLACE_ABI = [
  "function createAsset(string name, string assetType, uint256 totalValue, uint256 totalShares, uint256 pricePerShare, uint256 expectedYield) external returns (uint256)",
  "function purchaseShares(uint256 assetId, uint256 shares) external",
  "function claimYield(uint256 assetId) external",
  "function assets(uint256 assetId) view returns (string name, string assetType, uint256 totalValue, uint256 totalShares, uint256 availableShares, uint256 pricePerShare, uint256 expectedYield, address creator, bool isActive, uint256 createdAt)",
  "function userShares(uint256 assetId, address user) view returns (uint256)",
  "function getUserAssets(address user) view returns (uint256[])",
  "function getClaimableYield(uint256 assetId, address user) view returns (uint256)",
  "function totalAssetsCreated() view returns (uint256)",
  "event AssetCreated(uint256 indexed assetId, string name, address indexed creator, uint256 totalValue)",
  "event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 cost)",
  "event YieldClaimed(uint256 indexed assetId, address indexed user, uint256 amount)"
] as const;

export const COMPLIANCE_MODULE_ABI = [
  "function verifyKYC(address user, bytes zkProof) view returns (bool)",
  "function hasValidKYC(address user) view returns (bool)",
  "function meetsKYCTier(address user, string requiredTier) view returns (bool)",
  "function getUserKYCInfo(address user) view returns (bool whitelisted, string tier, uint256 timestamp, uint256 expiresAt)",
  "event UserWhitelisted(address indexed user, string tier)"
] as const;

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
] as const;

export function getContractAddress(chainId: number, contractName: keyof typeof CONTRACT_ADDRESSES[5003]) {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  return addresses?.[contractName] || '';
}