'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Building, 
  ArrowUpRight,
  PieChart,
  Target
} from 'lucide-react'
import { useStaking, useCreditToken, useRWAMarketplace, DEMO_MODE } from '@/hooks/useContractsUnified'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface OverviewTabProps {
  onTabChange?: (tab: string) => void
}

export default function OverviewTab({ onTabChange }: OverviewTabProps = {}) {
  const { address } = useAccount()
  
  // Unified contract data
  const {
    stakedAmount,
    pendingYield: stakingYield,
    totalStaked,
    tokenSymbol,
    stakingAPY
  } = useStaking(address)

  const {
    balance: creditBalance,
    tokenSymbol: creditSymbol,
    tokenAPY: creditAPY
  } = useCreditToken(address)

  // Calculate derived values from real data
  const tokenPrice = tokenSymbol === 'MNT' ? 0.85 : 2500 // MNT ~$0.85, mETH ~$2500
  const userDepositValue = parseFloat(stakedAmount) * tokenPrice
  const creditBalanceValue = parseFloat(creditBalance)
  const maxBorrowCapacity = userDepositValue * 0.8 // 80% LTV
  
  // Calculate yields based on demo mode
  const stakingAPYNum = parseFloat(stakingAPY?.replace('%', '') || '4.2')
  const creditAPYNum = parseFloat(creditAPY?.replace('%', '') || '4.5')
  
  const monthlyStakingYield = userDepositValue * (stakingAPYNum / 100) / 12
  
  // Mock RWA investments (assume 60% of credit used for RWA)
  const rwaInvestments = creditBalanceValue * 0.6
  const rwaAPY = 8.3
  const monthlyRWAYield = rwaInvestments * (rwaAPY / 100) / 12
  
  const totalMonthlyYield = monthlyStakingYield + monthlyRWAYield
  const totalPortfolioValue = userDepositValue + rwaInvestments
  const combinedAPY = totalPortfolioValue > 0 ? ((totalMonthlyYield * 12) / totalPortfolioValue) * 100 : 0
  
  // Health factor calculation (simplified)
  const healthFactor = userDepositValue > 0 ? (userDepositValue * 2) / (creditBalanceValue || 1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center font-heading">
            <PieChart className="w-8 h-8 mr-3" />
            Portfolio Overview
          </h2>
          <p className="text-gray-600 font-body">
            Your complete Mantle Prime investment dashboard
          </p>
        </div>
        
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          {formatNumber(combinedAPY, 1)}% Total APY
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black font-heading">
              {formatCurrency(totalPortfolioValue)}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="text-green-600 text-sm font-semibold font-mono">+{formatNumber(combinedAPY, 1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">{tokenSymbol} Collateral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black font-heading">
              {formatNumber(parseFloat(stakedAmount), 2)} {tokenSymbol}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {formatCurrency(userDepositValue)} value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Credit Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black font-heading">
              {formatCurrency(creditBalanceValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {formatCurrency(maxBorrowCapacity - creditBalanceValue)} available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Monthly Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-heading">
              {formatCurrency(totalMonthlyYield)}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Combined mETH + RWA yields
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Double Yield Breakdown */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black font-heading">Double Yield Strategy</CardTitle>
          <CardDescription className="text-gray-600 font-body">
            Earn from both mETH staking and RWA investments simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Token Staking */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <span className="text-black font-semibold font-heading">{tokenSymbol} Staking Yield</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {stakingAPY} APY
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Staked:</span>
                  <span className="text-black font-mono">{formatNumber(parseFloat(stakedAmount), 2)} {tokenSymbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Earnings:</span>
                  <span className="text-blue-600 font-mono">{formatCurrency(monthlyStakingYield)}</span>
                </div>
              </div>
            </div>

            {/* RWA Yield */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <span className="text-black font-semibold font-heading">RWA Investment Yield</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  {rwaAPY}% APY
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Invested:</span>
                  <span className="text-black font-mono">{formatCurrency(rwaInvestments)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Earnings:</span>
                  <span className="text-purple-600 font-mono">{formatCurrency(monthlyRWAYield)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-black flex items-center font-heading">
              <Wallet className="w-5 h-5 mr-2" />
              Deposit mETH
            </CardTitle>
            <CardDescription className="text-gray-600 font-body">
              Add more collateral to increase borrowing capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => onTabChange?.('vault')}
            >
              Go to Vault
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-black flex items-center font-heading">
              <CreditCard className="w-5 h-5 mr-2" />
              Issue Credit
            </CardTitle>
            <CardDescription className="text-gray-600 font-body">
              Mint USDY against your mETH collateral
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => onTabChange?.('credit')}
            >
              Issue USDY
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-black flex items-center font-heading">
              <Building className="w-5 h-5 mr-2" />
              Buy RWAs
            </CardTitle>
            <CardDescription className="text-gray-600 font-body">
              Invest in fractional real-world assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => onTabChange?.('marketplace')}
            >
              Browse Assets
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Factor */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center font-heading">
            <Target className="w-5 h-5 mr-2" />
            Position Health
          </CardTitle>
          <CardDescription className="text-gray-600 font-body">
            Monitor your collateral ratio and liquidation risk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Health Factor</span>
            <span className={`font-semibold text-lg font-heading ${
              healthFactor >= 1.5 ? 'text-green-600' : 
              healthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {formatNumber(healthFactor, 2)}x
            </span>
          </div>
          <Progress 
            value={Math.min((healthFactor / 2) * 100, 100)} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Liquidation at 1.2x</span>
            <span>Safe above 1.5x</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}