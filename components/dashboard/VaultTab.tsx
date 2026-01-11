'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp
} from 'lucide-react'
import { useStaking } from '@/hooks/useContractsUnified'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { showTransactionSuccess, showTransactionError } from '@/lib/transaction-utils'

export default function VaultTab() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  // Real contract data using unified hooks
  const {
    tokenBalance,
    stakedAmount,
    pendingYield,
    totalStaked,
    stakeTokens,
    claimStakingYield,
    isStaking,
    isClaiming,
    tokenSymbol,
    stakingAPY
  } = useStaking(address)

  // Calculate derived values
  const tokenPrice = tokenSymbol === 'MNT' ? 0.85 : 2500 // MNT ~$0.85, mETH ~$2500
  const userDepositValue = parseFloat(stakedAmount) * tokenPrice
  const apyNumber = parseFloat(stakingAPY.replace('%', ''))
  const monthlyYield = userDepositValue * (apyNumber / 100) / 12
  const healthFactor = 1.67 // Mock for now - calculate from credit usage

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    try {
      // Show loading state
      toast({
        title: "🔄 Processing Stake",
        description: `Staking ${depositAmount} ${tokenSymbol}. Please confirm in your wallet...`,
        duration: 3000,
      })
      
      const txHash = await stakeTokens(depositAmount)
      
      // Only show success if we get a valid transaction hash
      if (txHash && txHash !== '0x' && txHash.length === 66) {
        setDepositAmount('')
        
        // Create clickable explorer link
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`
        const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
        
        toast({
          title: "✅ Staking Successful",
          description: `Successfully staked ${depositAmount} ${tokenSymbol}. You're now earning ${stakingAPY} staking rewards!`,
          duration: 8000,
        })

        // Show explorer link in console
        console.log(`✅ Staking Successful`)
        console.log(`Transaction Hash: ${txHash}`)
        console.log(`Explorer Link: ${explorerUrl}`)
        console.log(`Click to view: ${explorerUrl}`)
        
      } else {
        throw new Error('Invalid or empty transaction hash received')
      }
    } catch (error: any) {
      console.error('Deposit failed:', error)
      
      let errorMessage = `Failed to stake ${tokenSymbol}. Please try again.`
      
      // Parse specific error messages
      if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient MNT tokens for gas fees or staking amount."
      } else if (error?.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled in your wallet."
      } else if (error?.shortMessage) {
        errorMessage = `Staking failed: ${error.shortMessage}`
      }
      
      toast({
        title: "❌ Staking Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      })
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    
    // For simplified demo, we don't have unstake function yet
    toast({
      title: "Withdraw Not Available",
      description: "Unstaking feature coming soon in full version",
      variant: "destructive",
    })
  }

  const handleClaimYield = async () => {
    try {
      // Show loading state
      toast({
        title: "🔄 Processing Yield Claim",
        description: "Claiming staking rewards. Please confirm in your wallet...",
        duration: 3000,
      })
      
      const txHash = await claimStakingYield()
      
      // Only show success if we get a valid transaction hash
      if (txHash && txHash !== '0x' && txHash.length === 66) {
        // Create clickable explorer link
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`
        const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
        
        toast({
          title: "✅ Yield Claimed Successfully",
          description: `Successfully claimed ${pendingYield} ${tokenSymbol} staking rewards. Keep staking to earn more!`,
          duration: 8000,
        })

        // Show explorer link in console
        console.log(`✅ Yield Claim Successful`)
        console.log(`Transaction Hash: ${txHash}`)
        console.log(`Explorer Link: ${explorerUrl}`)
        console.log(`Click to view: ${explorerUrl}`)
        
      } else {
        throw new Error('Invalid or empty transaction hash received')
      }
    } catch (error: any) {
      console.error('Claim failed:', error)
      
      let errorMessage = "Failed to claim staking yield. Please try again."
      
      // Parse specific error messages
      if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient MNT tokens for gas fees."
      } else if (error?.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled in your wallet."
      } else if (error?.shortMessage) {
        errorMessage = `Yield claim failed: ${error.shortMessage}`
      }
      
      toast({
        title: "❌ Yield Claim Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      })
    }
  }

  const maxDeposit = parseFloat(tokenBalance)
  const maxWithdraw = parseFloat(stakedAmount)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center">
            <Wallet className="w-8 h-8 mr-3" />
            {tokenSymbol} Staking Vault
          </h2>
          <p className="text-gray-600">
            Stake {tokenSymbol} to earn staking rewards and use as collateral
          </p>
        </div>
        
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          {stakingAPY} APY
        </Badge>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {formatNumber(maxDeposit, 3)} {tokenSymbol}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available to stake
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Staked Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {formatNumber(parseFloat(stakedAmount), 3)} {tokenSymbol}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Earning staking rewards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Pending Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(parseFloat(pendingYield), 6)} {tokenSymbol}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ready to claim
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Collateral Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {formatCurrency(userDepositValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total USD value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deposit Section */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <ArrowDownLeft className="w-5 h-5 mr-2 text-green-600" />
              Stake {tokenSymbol}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Stake {tokenSymbol} to earn {stakingAPY} rewards and use as collateral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount" className="text-gray-600">
                Amount to Stake
              </Label>
              <div className="relative">
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-white border-gray-300 text-black pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {tokenSymbol}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Balance: {formatNumber(maxDeposit, 3)} {tokenSymbol}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-300 p-0 h-auto"
                  onClick={() => setDepositAmount((maxDeposit * 0.9).toString())} // Leave some for gas
                >
                  Max
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleDeposit}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > maxDeposit || isStaking}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isStaking ? 'Staking...' : `Stake ${tokenSymbol}`}
            </Button>
          </CardContent>
        </Card>

        {/* Claim Yield Section */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Claim Yield
            </CardTitle>
            <CardDescription className="text-gray-600">
              Claim your accumulated staking rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-600">
                Available Yield
              </Label>
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(parseFloat(pendingYield), 6)} {tokenSymbol}
              </div>
              <p className="text-sm text-gray-500">
                ≈ {formatCurrency(parseFloat(pendingYield) * tokenPrice)}
              </p>
            </div>

            <Button 
              onClick={handleClaimYield}
              disabled={parseFloat(pendingYield) <= 0 || isClaiming}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isClaiming ? 'Claiming...' : 'Claim Yield'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Total Protocol Stats */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Protocol Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Staked</p>
              <p className="text-2xl font-bold text-black">
                {formatNumber(parseFloat(totalStaked), 2)} {tokenSymbol}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Share</p>
              <p className="text-2xl font-bold text-black">
                {parseFloat(totalStaked) > 0 
                  ? ((parseFloat(stakedAmount) / parseFloat(totalStaked)) * 100).toFixed(2)
                  : '0.00'
                }%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">APY</p>
              <p className="text-2xl font-bold text-green-600">{stakingAPY}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}