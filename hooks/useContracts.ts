import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, Address } from 'viem'

// Contract addresses from deployment (will be updated after mock deployment)
const CONTRACTS = {
  MOCK_METH: '0x...' as Address, // Will be updated after deployment
  MOCK_USDY: '0x...' as Address, // Will be updated after deployment
  COMPLIANCE_MODULE: '0xa31749b81470eD13C5efeAa290Cf1caB67Aeb425' as Address,
  PRIME_VAULT: '0xEa53E2fF08CD18fD31B188a72079aE9Ca34856e4' as Address,
  CREDIT_ISSUER: '0x464D37393C8D3991b493DBb57F5f3b8c31c7Fa60' as Address,
  RWA_MARKETPLACE: '0xcf4F105FeAc23F00489a7De060D34959f8796dd0' as Address,
}

// Mock mETH ABI (simplified)
const MOCK_METH_ABI = [
  {
    "inputs": [],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "pendingYield",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "getStakingInfo",
    "outputs": [
      {"type": "uint256", "name": "stakedAmount"},
      {"type": "uint256", "name": "pendingYield"},
      {"type": "uint256", "name": "lastUpdate"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "account"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "spender"}, {"type": "uint256", "name": "amount"}],
    "name": "approve",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Updated PrimeVault ABI for mock integration
const PRIME_VAULT_ABI = [
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "getUserDeposit",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDeposits",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "getPendingYield",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

const CREDIT_ISSUER_ABI = [
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "issueCredit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "repayCredit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}],
    "name": "getCreditLine",
    "outputs": [{"type": "uint256", "name": "issued"}, {"type": "uint256", "name": "available"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const RWA_MARKETPLACE_ABI = [
  {
    "inputs": [{"type": "uint256", "name": "assetId"}, {"type": "uint256", "name": "shares"}],
    "name": "purchaseShares",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "assetId"}],
    "name": "claimYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "assetId"}],
    "name": "getAssetInfo",
    "outputs": [
      {"type": "string", "name": "name"},
      {"type": "uint256", "name": "totalShares"},
      {"type": "uint256", "name": "availableShares"},
      {"type": "uint256", "name": "pricePerShare"},
      {"type": "uint256", "name": "apy"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "user"}, {"type": "uint256", "name": "assetId"}],
    "name": "getUserShares",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Hook for MockMETH token
export function useMockMETH(userAddress?: Address) {
  const { data: balance } = useReadContract({
    address: CONTRACTS.MOCK_METH,
    abi: MOCK_METH_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { data: stakingInfo } = useReadContract({
    address: CONTRACTS.MOCK_METH,
    abi: MOCK_METH_ABI,
    functionName: 'getStakingInfo',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { writeContract: faucet, isPending: isFauceting } = useWriteContract()
  const { writeContract: stake, isPending: isStaking } = useWriteContract()
  const { writeContract: claimYield, isPending: isClaiming } = useWriteContract()
  const { writeContract: approve, isPending: isApproving } = useWriteContract()

  const getMETHFromFaucet = async () => {
    faucet({
      address: CONTRACTS.MOCK_METH,
      abi: MOCK_METH_ABI,
      functionName: 'faucet'
    })
  }

  const stakeMETH = async (amount: string) => {
    stake({
      address: CONTRACTS.MOCK_METH,
      abi: MOCK_METH_ABI,
      functionName: 'stake',
      args: [parseEther(amount)]
    })
  }

  const claimMETHYield = async () => {
    claimYield({
      address: CONTRACTS.MOCK_METH,
      abi: MOCK_METH_ABI,
      functionName: 'claimYield'
    })
  }

  const approveMETH = async (spender: Address, amount: string) => {
    approve({
      address: CONTRACTS.MOCK_METH,
      abi: MOCK_METH_ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)]
    })
  }

  return {
    balance: balance ? formatEther(balance) : '0',
    stakedAmount: stakingInfo ? formatEther(stakingInfo[0]) : '0',
    pendingYield: stakingInfo ? formatEther(stakingInfo[1]) : '0',
    getMETHFromFaucet,
    stakeMETH,
    claimMETHYield,
    approveMETH,
    isFauceting,
    isStaking,
    isClaiming,
    isApproving
  }
}

// Hook for PrimeVault contract (updated for mock integration)
export function usePrimeVault(userAddress?: Address) {
  const { data: userDeposit } = useReadContract({
    address: CONTRACTS.PRIME_VAULT,
    abi: PRIME_VAULT_ABI,
    functionName: 'getUserDeposit',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { data: totalDeposits } = useReadContract({
    address: CONTRACTS.PRIME_VAULT,
    abi: PRIME_VAULT_ABI,
    functionName: 'totalDeposits',
  })

  const { data: pendingYield } = useReadContract({
    address: CONTRACTS.PRIME_VAULT,
    abi: PRIME_VAULT_ABI,
    functionName: 'getPendingYield',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { writeContract: deposit, isPending: isDepositing } = useWriteContract()
  const { writeContract: withdraw, isPending: isWithdrawing } = useWriteContract()
  const { writeContract: claimYield, isPending: isClaiming } = useWriteContract()

  const depositMETH = async (amount: string) => {
    deposit({
      address: CONTRACTS.PRIME_VAULT,
      abi: PRIME_VAULT_ABI,
      functionName: 'deposit',
      args: [parseEther(amount)]
    })
  }

  const withdrawMETH = async (amount: string) => {
    withdraw({
      address: CONTRACTS.PRIME_VAULT,
      abi: PRIME_VAULT_ABI,
      functionName: 'withdraw',
      args: [parseEther(amount)]
    })
  }

  const claimVaultYield = async () => {
    claimYield({
      address: CONTRACTS.PRIME_VAULT,
      abi: PRIME_VAULT_ABI,
      functionName: 'claimYield'
    })
  }

  return {
    userDeposit: userDeposit ? formatEther(userDeposit) : '0',
    totalDeposits: totalDeposits ? formatEther(totalDeposits) : '0',
    pendingYield: pendingYield ? formatEther(pendingYield) : '0',
    depositMETH,
    withdrawMETH,
    claimVaultYield,
    isDepositing,
    isWithdrawing,
    isClaiming
  }
}

// Hook for CreditIssuer contract
export function useCreditIssuer(userAddress?: Address) {
  const { data: creditLine } = useReadContract({
    address: CONTRACTS.CREDIT_ISSUER,
    abi: CREDIT_ISSUER_ABI,
    functionName: 'getCreditLine',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { writeContract: issueCredit, isPending: isIssuing } = useWriteContract()
  const { writeContract: repayCredit, isPending: isRepaying } = useWriteContract()

  const issueCreditLine = async (amount: string) => {
    issueCredit({
      address: CONTRACTS.CREDIT_ISSUER,
      abi: CREDIT_ISSUER_ABI,
      functionName: 'issueCredit',
      args: [parseEther(amount)]
    })
  }

  const repayCreditLine = async (amount: string) => {
    repayCredit({
      address: CONTRACTS.CREDIT_ISSUER,
      abi: CREDIT_ISSUER_ABI,
      functionName: 'repayCredit',
      args: [parseEther(amount)]
    })
  }

  return {
    creditIssued: creditLine ? formatEther(creditLine[0]) : '0',
    creditAvailable: creditLine ? formatEther(creditLine[1]) : '0',
    issueCreditLine,
    repayCreditLine,
    isIssuing,
    isRepaying
  }
}

// Hook for RWAMarketplace contract
export function useRWAMarketplace(userAddress?: Address) {
  const { writeContract: purchaseShares, isPending: isPurchasing } = useWriteContract()
  const { writeContract: claimYield, isPending: isClaiming } = useWriteContract()

  const getAssetInfo = (assetId: number) => {
    return useReadContract({
      address: CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getAssetInfo',
      args: [BigInt(assetId)]
    })
  }

  const getUserShares = (assetId: number) => {
    return useReadContract({
      address: CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getUserShares',
      args: userAddress ? [userAddress, BigInt(assetId)] : undefined,
      query: { enabled: !!userAddress }
    })
  }

  const buyShares = async (assetId: number, shares: number) => {
    purchaseShares({
      address: CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'purchaseShares',
      args: [BigInt(assetId), BigInt(shares)]
    })
  }

  const claimAssetYield = async (assetId: number) => {
    claimYield({
      address: CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'claimYield',
      args: [BigInt(assetId)]
    })
  }

  return {
    getAssetInfo,
    getUserShares,
    buyShares,
    claimAssetYield,
    isPurchasing,
    isClaiming
  }
}

export { CONTRACTS }