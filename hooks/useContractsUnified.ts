import { useReadContract, useWriteContract, useBalance, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, Address } from 'viem'

// Get demo mode from environment
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE || 'simplified'

// Helper function to ensure we have valid contract addresses
const getValidAddress = (address: string | undefined, fallback: string): Address => {
  if (!address || address === '0x...' || address.length < 42) {
    return fallback as Address
  }
  return address as Address
}

// Unified ABIs
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
  }
] as const

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
    "name": "getAssetInfo",
    "outputs": [
      {"type": "string", "name": "name"},
      {"type": "uint256", "name": "totalShares"},
      {"type": "uint256", "name": "availableShares"},
      {"type": "uint256", "name": "pricePerShare"},
      {"type": "uint256", "name": "expectedYield"}
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
    "inputs": [],
    "name": "getAssetCount",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Unified hook for staking (works with both MNT and mETH)
export function useStaking(userAddress?: Address) {
  // Get user's native balance (MNT or ETH)
  const { data: nativeBalance } = useBalance({
    address: userAddress,
  })

  if (DEMO_MODE === 'simplified') {
    // Simplified MNT staking
    const stakingVaultAddress = getValidAddress(
      process.env.NEXT_PUBLIC_MANTLE_STAKING_VAULT_ADDRESS,
      '0x5F18fe5bF76466CacD97E855C471E6F017603583'
    )

    const { data: stakeInfo } = useReadContract({
      address: stakingVaultAddress,
      abi: MANTLE_STAKING_VAULT_ABI,
      functionName: 'getStakeInfo',
      args: userAddress ? [userAddress] : undefined,
      query: { enabled: !!userAddress }
    })

    const { data: totalStaked } = useReadContract({
      address: stakingVaultAddress,
      abi: MANTLE_STAKING_VAULT_ABI,
      functionName: 'totalStaked',
    })

    const { writeContractAsync: stakeAsync, isPending: isStaking } = useWriteContract()
    const { writeContractAsync: claimYieldAsync, isPending: isClaiming } = useWriteContract()

    const stakeTokens = async (amount: string) => {
      const hash = await stakeAsync({
        address: stakingVaultAddress,
        abi: MANTLE_STAKING_VAULT_ABI,
        functionName: 'stake',
        value: parseEther(amount)
      })
      return hash
    }

    const claimStakingYield = async () => {
      const hash = await claimYieldAsync({
        address: stakingVaultAddress,
        abi: MANTLE_STAKING_VAULT_ABI,
        functionName: 'claimYield'
      })
      return hash
    }

    return {
      tokenBalance: nativeBalance ? formatEther(nativeBalance.value) : '0',
      stakedAmount: stakeInfo ? formatEther(stakeInfo[0]) : '0',
      pendingYield: stakeInfo ? formatEther(stakeInfo[1]) : '0',
      totalStaked: totalStaked ? formatEther(totalStaked) : '0',
      stakeTokens,
      claimStakingYield,
      isStaking,
      isClaiming,
      tokenSymbol: 'MNT',
      stakingAPY: '4.2%'
    }
  } else {
    // Original mETH system - would need to implement mETH contract calls
    // For now, return placeholder data
    return {
      tokenBalance: '0',
      stakedAmount: '0',
      pendingYield: '0',
      totalStaked: '0',
      stakeTokens: async () => { return '' },
      claimStakingYield: async () => { return '' },
      isStaking: false,
      isClaiming: false,
      tokenSymbol: 'mETH',
      stakingAPY: '4.2%'
    }
  }
}

// Unified hook for credit tokens (MockUSDY or real USDY)
export function useCreditToken(userAddress?: Address) {
  if (DEMO_MODE === 'simplified') {
    const mockUSDYAddress = getValidAddress(
      process.env.NEXT_PUBLIC_MOCK_USDY_ADDRESS,
      '0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9'
    )

    const { data: balance } = useReadContract({
      address: mockUSDYAddress,
      abi: MOCK_USDY_ABI,
      functionName: 'balanceOf',
      args: userAddress ? [userAddress] : undefined,
      query: { enabled: !!userAddress }
    })

    const { writeContractAsync: faucetAsync, isPending: isFauceting } = useWriteContract()
    const { writeContractAsync: claimYieldAsync, isPending: isClaiming } = useWriteContract()
    const { writeContractAsync: approveAsync, isPending: isApproving } = useWriteContract()

    const getTokensFromFaucet = async () => {
      const hash = await faucetAsync({
        address: mockUSDYAddress,
        abi: MOCK_USDY_ABI,
        functionName: 'faucet'
      })
      return hash
    }

    const claimTokenYield = async () => {
      const hash = await claimYieldAsync({
        address: mockUSDYAddress,
        abi: MOCK_USDY_ABI,
        functionName: 'claimYield'
      })
      return hash
    }

    const approveToken = async (spender: Address, amount: string) => {
      const hash = await approveAsync({
        address: mockUSDYAddress,
        abi: MOCK_USDY_ABI,
        functionName: 'approve',
        args: [spender, parseEther(amount)]
      })
      return hash
    }

    return {
      balance: balance ? formatEther(balance) : '0',
      getTokensFromFaucet,
      claimTokenYield,
      approveToken,
      isFauceting,
      isClaiming,
      isApproving,
      tokenSymbol: 'USDY',
      tokenAPY: '4.5%',
      hasFaucet: true
    }
  } else {
    // Original USDY system - would need to implement real USDY contract calls
    return {
      balance: '0',
      getTokensFromFaucet: async () => { return '' },
      claimTokenYield: async () => { return '' },
      approveToken: async () => { return '' },
      isFauceting: false,
      isClaiming: false,
      isApproving: false,
      tokenSymbol: 'USDY',
      tokenAPY: '4.5%',
      hasFaucet: false
    }
  }
}

// Unified hook for RWA marketplace
export function useRWAMarketplace(userAddress?: Address) {
  const marketplaceAddress = DEMO_MODE === 'simplified' 
    ? getValidAddress(process.env.NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS, '0x703C397732f6F13D11Ee71154B462969C5CF75f4')
    : getValidAddress(process.env.NEXT_PUBLIC_RWA_MARKETPLACE_ADDRESS, '0xcf4F105FeAc23F00489a7De060D34959f8796dd0')

  const { writeContractAsync: purchaseSharesAsync, isPending: isPurchasing } = useWriteContract()

  const getAssetInfo = (assetId: number) => {
    return useReadContract({
      address: marketplaceAddress,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getAssetInfo',
      args: [BigInt(assetId)]
    })
  }

  const getUserShares = (assetId: number) => {
    return useReadContract({
      address: marketplaceAddress,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'getUserShares',
      args: userAddress ? [userAddress, BigInt(assetId)] : undefined,
      query: { enabled: !!userAddress }
    })
  }

  const buyShares = async (assetId: number, shares: number) => {
    // Validate inputs
    if (!assetId && assetId !== 0) throw new Error('Invalid asset ID')
    if (!shares || shares <= 0) throw new Error('Invalid number of shares')
    
    const hash = await purchaseSharesAsync({
      address: marketplaceAddress,
      abi: RWA_MARKETPLACE_ABI,
      functionName: 'purchaseShares',
      args: [BigInt(assetId), BigInt(shares)]
    })
    return hash
  }

  return {
    getAssetInfo,
    getUserShares,
    buyShares,
    isPurchasing
  }
}

// Export demo mode and helper function
export { DEMO_MODE, getValidAddress }