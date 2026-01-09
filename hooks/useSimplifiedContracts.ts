import { useReadContract, useWriteContract, useBalance } from 'wagmi'
import { parseEther, formatEther, Address } from 'viem'

// Contract addresses (updated after deployment)
const SIMPLIFIED_CONTRACTS = {
  MANTLE_STAKING_VAULT: '0x5F18fe5bF76466CacD97E855C471E6F017603583' as Address,
  MOCK_USDY: '0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9' as Address,
  COMPLIANCE_MODULE: '0x9998FE942B5D873c5324295a5F1793DFCB6D5510' as Address,
  RWA_MARKETPLACE: '0x703C397732f6F13D11Ee71154B462969C5CF75f4' as Address,
}

// MantleStakingVault ABI
const MANTLE_STAKING_VAULT_ABI = [
  {
    "inputs": [],
    "name": "stake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "unstake",
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
    "name": "getStakeInfo",
    "outputs": [
      {"type": "uint256", "name": "stakedAmount"},
      {"type": "uint256", "name": "pendingYieldAmount"},
      {"type": "uint256", "name": "lastUpdate"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getYieldPool",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// MockUSDY ABI (simplified)
const MOCK_USDY_ABI = [
  {
    "inputs": [],
    "name": "faucet",
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

// RWAMarketplace ABI (same as before)
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
  },
  {
    "inputs": [{"type": "address", "name": "user"}, {"type": "uint256", "name": "assetId"}],
    "name": "getPendingYield",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Hook for MantleStakingVault (native MNT staking)
export function useMantleStaking(userAddress?: Address) {
  // Get user's native MNT balance
  const { data: mntBalance } = useBalance({
    address: userAddress,
  })

  const { data: stakeInfo } = useReadContract({
    address: SIMPLIFIED_CONTRACTS.MANTLE_STAKING_VAULT,
    abi: MANTLE_STAKING_VAULT_ABI,
    functionName: 'getStakeInfo',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { data: totalStaked } = useReadContract({
    address: SIMPLIFIED_CONTRACTS.MANTLE_STAKING_VAULT,
    abi: MANTLE_STAKING_VAULT_ABI,
    functionName: 'totalStaked',
  })

  const { data: yieldPool } = useReadContract({
    address: SIMPLIFIED_CONTRACTS.MANTLE_STAKING_VAULT,
    abi: MANTLE_STAKING_VAULT_ABI,
    functionName: 'getYieldPool',
  })

  const { writeContract: stake, isPending: isStaking } = useWriteContract()
  const { writeContract: unstake, isPending: isUnstaking } = useWriteContract()
  const { writeContract: claimYield, isPending: isClaiming } = useWriteContract()

  const stakeMNT = async (amount: string) => {
    stake({
      address: SIMPLIFIED_CONTRACTS.MANTLE_STAKING_VAULT,
      abi: MANTLE_STAKING_VAULT_ABI,
      functionName: 'stake',
      value: parseEther(amount)
    })
  }

  const unstakeMNT = async (amount: string) => {
    unstake({
      address: SIMPLIFIED_CONTRACTS.MANTLE_STAKING_VAULT,
      abi: MANTLE_STAKING_VAULT_ABI,
      functionName: 'unstake',
      args: [parseEther(amount)]
    })
  }

  const claimStakingYield = async () => {
    claimYield({
      address: SIMPLIFIED_CONTRACTS.MANTLE_STAKING_VAULT,
      abi: MANTLE_STAKING_VAULT_ABI,
      functionName: 'claimYield'
    })
  }

  return {
    mntBalance: mntBalance ? formatEther(mntBalance.value) : '0',
    stakedAmount: stakeInfo ? formatEther(stakeInfo[0]) : '0',
    pendingYield: stakeInfo ? formatEther(stakeInfo[1]) : '0',
    totalStaked: totalStaked ? formatEther(totalStaked) : '0',
    yieldPool: yieldPool ? formatEther(yieldPool) : '0',
    stakeMNT,
    unstakeMNT,
    claimStakingYield,
    isStaking,
    isUnstaking,
    isClaiming
  }
}

// Hook for MockUSDY (simplified credit system)
export function useMockUSDY(userAddress?: Address) {
  const { data: balance } = useReadContract({
    address: SIMPLIFIED_CONTRACTS.MOCK_USDY,
    abi: MOCK_USDY_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { data: pendingYield } = useReadContract({
    address: SIMPLIFIED_CONTRACTS.MOCK_USDY,
    abi: MOCK_USDY_ABI,
    functionName: 'pendingYield',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress }
  })

  const { writeContract: faucet, isPending: isFauceting } = useWriteContract()
  const { writeContract: claimYield, isPending: isClaiming } = useWriteContract()
  const { writeContract: approve, isPending: isApproving } = useWriteContract()

  const getUSDYFromFaucet = async () => {
    faucet({
      address: SIMPLIFIED_CONTRACTS.MOCK_USDY,
      abi: MOCK_USDY_ABI,
      functionName: 'faucet'
    })
  }

  const claimUSDYYield = async () => {
    claimYield({
      address: SIMPLIFIED_CONTRACTS.MOCK_USDY,
      abi: MOCK_USDY_ABI,
      functionName: 'claimYield'
    })
  }

  const approveUSDY = async (spender: Address, amount: string) => {
    approve({
      address: SIMPLIFIED_CONTRACTS.MOCK_USDY,
      abi: MOCK_USDY_ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)]
    })
  }

  return {
    balance: balance ? formatEther(balance) : '0',
    pendingYield: pendingYield ? formatEther(pendingYield) : '0',
    getUSDYFromFaucet,
    claimUSDYYield,
    approveUSDY,
    isFauceting,
    isClaiming,
    isApproving
  }
}

// Hook for RWAMarketplace (same as before but simplified)
export function useSimplifiedRWAMarketplace(userAddress?: Address) {
  const { writeContract: purchaseShares, isPending: isPurchasing } = useWriteContract()
  const { writeContract: claimYield, isPending: isClaiming } = useWriteContract()

  const getAssetInfo = (assetId: number) => {
    return useReadContract({
      address: SIMPLIFIED_CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getAssetInfo',
      args: [BigInt(assetId)]
    })
  }

  const getUserShares = (assetId: number) => {
    return useReadContract({
      address: SIMPLIFIED_CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getUserShares',
      args: userAddress ? [userAddress, BigInt(assetId)] : undefined,
      query: { enabled: !!userAddress }
    })
  }

  const getPendingYield = (assetId: number) => {
    return useReadContract({
      address: SIMPLIFIED_CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getPendingYield',
      args: userAddress ? [userAddress, BigInt(assetId)] : undefined,
      query: { enabled: !!userAddress }
    })
  }

  const buyShares = async (assetId: number, shares: number) => {
    purchaseShares({
      address: SIMPLIFIED_CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'purchaseShares',
      args: [BigInt(assetId), BigInt(shares)]
    })
  }

  const claimAssetYield = async (assetId: number) => {
    claimYield({
      address: SIMPLIFIED_CONTRACTS.RWA_MARKETPLACE,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'claimYield',
      args: [BigInt(assetId)]
    })
  }

  return {
    getAssetInfo,
    getUserShares,
    getPendingYield,
    buyShares,
    claimAssetYield,
    isPurchasing,
    isClaiming
  }
}

export { SIMPLIFIED_CONTRACTS }