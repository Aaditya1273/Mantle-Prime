'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp,
  Shield,
  AlertTriangle,
  Info
} from 'lucide-react'
import { CONTRACTS, TOKENS, PRIME_VAULT_ABI, ERC20_ABI } from '@/lib/wagmi'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function VaultTab() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Mock data - replace with real contract reads
  const [vaultData, setVaultData] = useState({
    mETHBalance: 25.5,
    mETHDeposited: 50.0,
    collateralValue: 125000, // USD value
    availableCollateral: 45000,
    creditUsed: 75000,
    healthFactor: 1.67,
    stakingAPY: 4.2,
    totalEarned: 2.1
  })

  // Real contract integration (uncomment when contracts are deployed)
  /*
  const { data: mETHBalance } = useReadContract({
    address: TOKENS.mETH,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data: userDeposits } = useReadContract({
    address: CONTRACTS.PrimeVault,
    abi: PRIME_VAULT_ABI,
    functionName: 'userDeposits',
    args: [address],
  })

  const { writeContract: depositMETH } = useWriteContract()
  */

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    
    setIsDepositing(true)
    try {
      // Step 1: Approve mETH spending
      console.log('Approving mETH spending...')
      // await writeContract({
      //   address: TOKENS.mETH,
      //   abi: ERC20_ABI,
      //   functionName: 'approve',
      //   args: [CONTRACTS.PrimeVault, parseEther(depositAmount)],
      // })

      // Step 2: Deposit to vault
      console.log('Depositing to vault...')
      // await writeContract({
      //   address: CONTRACTS.PrimeVault,
      //   abi: PRIME_VAULT_ABI,
      //   functionName: 'deposit',
      //   args: [parseEther(depositAmount)],
      // })

      // Mock success
      setTimeout(() => {
        setVaultData(prev => ({
          ...prev,
          mETHBalance: prev.mETHBalance - parseFloat(depositAmount),
          mETHDeposited: prev.mETHDeposited + parseFloat(depositAmount),
          collateralValue: prev.collateralValue + (parseFloat(depositAmount) * 2500), // $2500 per mETH
          availableCollateral: prev.availableCollateral + (parseFloat(depositAmount) * 2500)
        }))
        setDepositAmount('')
        setIsDepositing(false)
        toast({
          title: "Deposit Successful",
          description: `Successfully deposited ${depositAmount} mETH to vault`,
          variant: "success",
        })
      }, 2000)

    } catch (error) {
      console.error('Deposit failed:', error)
      setIsDepositing(false)
      toast({
        title: "Deposit Failed",
        description: "Failed to deposit mETH. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    
    setIsWithdrawing(true)
    try {
      console.log('Withdrawing from vault...')
      // await writeContract({
      //   address: CONTRACTS.PrimeVault,
      //   abi: PRIME_VAULT_ABI,
      //   functionName: 'withdraw',
      //   args: [parseEther(withdrawAmount)],
      // })

      // Mock success
      setTimeout(() => {
        setVaultData(prev => ({
          ...prev,
          mETHBalance: prev.mETHBalance + parseFloat(withdrawAmount),
          mETHDeposited: prev.mETHDeposited - parseFloat(withdrawAmount),
          collateralValue: prev.collateralValue - (parseFloat(withdrawAmount) * 2500),
          availableCollateral: prev.availableCollateral - (parseFloat(withdrawAmount) * 2500)
        }))
        setWithdrawAmount('')
        setIsWithdrawing(false)
        toast({
          title: "Withdrawal Successful",
          description: `Successfully withdrew ${withdrawAmount} mETH from vault`,
          variant: "success",
        })
      }, 2000)

    } catch (error) {
      console.error('Withdraw failed:', error)
      setIsWithdrawing(false)
      toast({
        title: "Withdrawal Failed",
        description: "Failed to withdraw mETH. Please try again.",
        variant: "destructive",
      })
    }
  }

  const maxDeposit = vaultData.mETHBalance
  const maxWithdraw = Math.min(
    vaultData.mETHDeposited,
    vaultData.availableCollateral / 2500 // Available collateral in mETH
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Wallet className="w-8 h-8 mr-3" />
            mETH Vault
          </h2>
          <p className="text-gray-300">
            Deposit mETH as collateral and earn ~4% staking rewards
          </p>
        </div>
        
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          <TrendingUp className="w-3 h-3 mr-1" />
          {vaultData.stakingAPY}% APY
        </Badge>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatNumber(vaultData.mETHBalance, 3)} mETH
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Available to deposit
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Deposited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatNumber(vaultData.mETHDeposited, 3)} mETH
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Earning staking rewards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Collateral Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(vaultData.collateralValue)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Total USD value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Health Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {vaultData.healthFactor}x
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Liquidation at 1.2x
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deposit Section */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ArrowDownLeft className="w-5 h-5 mr-2 text-green-400" />
              Deposit mETH
            </CardTitle>
            <CardDescription className="text-gray-300">
              Deposit mETH to earn staking rewards and use as collateral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount" className="text-gray-300">
                Amount to Deposit
              </Label>
              <div className="relative">
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-white/5 border-white/20 text-white pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  mETH
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Balance: {formatNumber(vaultData.mETHBalance, 3)} mETH
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                  onClick={() => setDepositAmount(maxDeposit.toString())}
                >
                  Max
                </Button>
              </div>
            </div>

            {/* Deposit Preview */}
            {depositAmount && parseFloat(depositAmount) > 0 && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Collateral Added:</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(parseFloat(depositAmount) * 2500)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Annual Staking Yield:</span>
                  <span className="text-green-400 font-semibold">
                    ~{formatNumber(parseFloat(depositAmount) * vaultData.stakingAPY / 100, 3)} mETH/year
                  </span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleDeposit}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > maxDeposit || isDepositing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isDepositing ? 'Depositing...' : 'Deposit mETH'}
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw Section */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ArrowUpRight className="w-5 h-5 mr-2 text-red-400" />
              Withdraw mETH
            </CardTitle>
            <CardDescription className="text-gray-300">
              Withdraw mETH while maintaining collateral requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount" className="text-gray-300">
                Amount to Withdraw
              </Label>
              <div className="relative">
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-white/5 border-white/20 text-white pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  mETH
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Max Withdrawable: {formatNumber(maxWithdraw, 3)} mETH
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                  onClick={() => setWithdrawAmount(maxWithdraw.toString())}
                >
                  Max
                </Button>
              </div>
            </div>

            {/* Withdraw Warning */}
            {withdrawAmount && parseFloat(withdrawAmount) > maxWithdraw && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm">
                    Withdrawal would violate collateral requirements
                  </span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > maxWithdraw || isWithdrawing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw mETH'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Collateral Status */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Collateral Status
          </CardTitle>
          <CardDescription className="text-gray-300">
            Monitor your collateral health and borrowing capacity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Collateral Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Collateral</span>
                <span className="text-white font-semibold">
                  {formatCurrency(vaultData.collateralValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Credit Used</span>
                <span className="text-white font-semibold">
                  {formatCurrency(vaultData.creditUsed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Available</span>
                <span className="text-green-400 font-semibold">
                  {formatCurrency(vaultData.availableCollateral)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Health Factor</span>
                <span className={`font-semibold ${
                  vaultData.healthFactor >= 1.5 ? 'text-green-400' : 
                  vaultData.healthFactor >= 1.2 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {vaultData.healthFactor}x
                </span>
              </div>
              <Progress 
                value={Math.min((vaultData.healthFactor / 2) * 100, 100)} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">
                Liquidation occurs below 1.2x
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Staking Rewards</span>
                <span className="text-green-400 font-semibold">
                  +{formatNumber(vaultData.totalEarned, 3)} mETH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current APY</span>
                <span className="text-blue-400 font-semibold">
                  {vaultData.stakingAPY}%
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Rewards compound automatically
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-blue-200 font-medium text-sm">
                  How mETH Vault Works
                </p>
                <p className="text-blue-300/80 text-sm">
                  Your deposited mETH continues earning ~4% staking rewards while serving as collateral. 
                  You can use up to 80% of your collateral value to issue USDY credit lines for RWA investments.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}