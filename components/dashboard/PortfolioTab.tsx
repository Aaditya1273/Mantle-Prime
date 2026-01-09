'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Wallet, 
  Building, 
  DollarSign,
  Percent,
  Calendar,
  ArrowUpRight,
  Gift,
  PieChart
} from 'lucide-react'
import { useStaking, useCreditToken, useRWAMarketplace } from '@/hooks/useContractsUnified'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface RWAHolding {
  id: number
  name: string
  type: string
  sharesOwned: number
  totalShares: number
  pricePerShare: number
  currentValue: number
  purchaseValue: number
  expectedYield: number
  yieldEarned: number
  claimableYield: number
  purchaseDate: string
  lastYieldClaim: string
}

export default function PortfolioTab() {
  const { address } = useAccount()
  
  // Real contract data
  const { stakedAmount, tokenSymbol, stakingAPY } = useStaking(address)
  const { balance: creditBalance, tokenSymbol: creditSymbol } = useCreditToken(address)
  const { claimAssetYield, isClaiming } = useRWAMarketplace(address)

  // Calculate real portfolio values
  const tokenPrice = tokenSymbol === 'MNT' ? 0.85 : 2500 // MNT ~$0.85, mETH ~$2500
  const stakedValue = parseFloat(stakedAmount) * tokenPrice
  const creditBalanceValue = parseFloat(creditBalance)
  const rwaInvestmentValue = creditBalanceValue * 0.6 // Assume 60% of credit used for RWA
  
  // Calculate yields
  const stakingAPYNum = parseFloat(stakingAPY?.replace('%', '') || '4.2')
  const rwaAPY = 8.3
  const stakingMonthlyYield = stakedValue * (stakingAPYNum / 100) / 12
  const rwaMonthlyYield = rwaInvestmentValue * (rwaAPY / 100) / 12
  const totalMonthlyYield = stakingMonthlyYield + rwaMonthlyYield
  
  // Mock RWA holdings based on real investment value
  const [rwaHoldings] = useState<RWAHolding[]>([
    {
      id: 0,
      name: "Miami Beach Luxury Apartment",
      type: "Real Estate",
      sharesOwned: Math.floor(rwaInvestmentValue * 0.4 / 50), // 40% allocation
      totalShares: 10000,
      pricePerShare: 50,
      currentValue: rwaInvestmentValue * 0.4,
      purchaseValue: rwaInvestmentValue * 0.4 * 0.95, // 5% appreciation
      expectedYield: 8.0,
      yieldEarned: (rwaInvestmentValue * 0.4) * 0.08 * 0.25, // 3 months yield
      claimableYield: (rwaInvestmentValue * 0.4) * 0.08 / 12, // 1 month claimable
      purchaseDate: "2024-01-15",
      lastYieldClaim: "2024-02-15"
    },
    {
      id: 1,
      name: "Corporate Bond Portfolio",
      type: "Private Debt",
      sharesOwned: Math.floor(rwaInvestmentValue * 0.35 / 50), // 35% allocation
      totalShares: 20000,
      pricePerShare: 50,
      currentValue: rwaInvestmentValue * 0.35,
      purchaseValue: rwaInvestmentValue * 0.35,
      expectedYield: 6.5,
      yieldEarned: (rwaInvestmentValue * 0.35) * 0.065 * 0.25,
      claimableYield: (rwaInvestmentValue * 0.35) * 0.065 / 12,
      purchaseDate: "2024-01-10",
      lastYieldClaim: "2024-02-10"
    },
    {
      id: 2,
      name: "Renewable Energy Project",
      type: "Infrastructure",
      sharesOwned: Math.floor(rwaInvestmentValue * 0.25 / 50), // 25% allocation
      totalShares: 15000,
      pricePerShare: 50,
      currentValue: rwaInvestmentValue * 0.25,
      purchaseValue: rwaInvestmentValue * 0.25 * 0.97, // 3% appreciation
      expectedYield: 9.2,
      yieldEarned: (rwaInvestmentValue * 0.25) * 0.092 * 0.25,
      claimableYield: (rwaInvestmentValue * 0.25) * 0.092 / 12,
      purchaseDate: "2024-01-08",
      lastYieldClaim: "2024-02-08"
    }
  ].filter(holding => holding.sharesOwned > 0)) // Only show holdings with shares

  // Calculate portfolio totals
  const totalRWAValue = rwaHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalRWAPurchaseValue = rwaHoldings.reduce((sum, holding) => sum + holding.purchaseValue, 0)
  const totalRWAGains = totalRWAValue - totalRWAPurchaseValue
  const totalYieldEarned = rwaHoldings.reduce((sum, holding) => sum + holding.yieldEarned, 0)
  const totalClaimableYield = rwaHoldings.reduce((sum, holding) => sum + holding.claimableYield, 0)
  const totalPortfolioValue = stakedValue + totalRWAValue
  const totalGains = totalRWAGains + (totalYieldEarned + stakingMonthlyYield * 3) // 3 months of staking yield

  const handleClaimYield = async (assetId: number) => {
    try {
      await claimAssetYield(assetId)
      // In a real implementation, this would update the UI after successful claim
    } catch (error) {
      console.error('Yield claim failed:', error)
    }
  }

  const handleClaimAllYield = async () => {
    try {
      // Claim yield from all assets
      for (const holding of rwaHoldings) {
        if (holding.claimableYield > 0) {
          await claimAssetYield(holding.id)
        }
      }
    } catch (error) {
      console.error('Claim all failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center font-heading">
            <PieChart className="w-8 h-8 mr-3" />
            My Portfolio
          </h2>
          <p className="text-gray-600 font-body">
            Track your mETH deposits, RWA investments, and yield earnings
          </p>
        </div>
        
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          {formatCurrency(totalClaimableYield)} Claimable
        </Badge>
      </div>

      {/* Portfolio Overview */}
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
              <span className="text-green-600 text-sm font-semibold font-mono">
                +{formatCurrency(totalGains)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">mETH Collateral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 font-heading">
              {formatCurrency(stakedValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {formatNumber(parseFloat(stakedAmount), 2)} {tokenSymbol} staked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">RWA Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 font-heading">
              {formatCurrency(totalRWAValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {rwaHoldings.length} active positions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Yield Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-heading">
              {formatCurrency(totalYieldEarned + stakingMonthlyYield * 3)}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Breakdown */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 border border-gray-200">
          <TabsTrigger value="holdings" className="data-[state=active]:bg-white">
            RWA Holdings
          </TabsTrigger>
          <TabsTrigger value="yields" className="data-[state=active]:bg-white">
            Yield History
          </TabsTrigger>
          <TabsTrigger value="allocation" className="data-[state=active]:bg-white">
            Asset Allocation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          {/* Claimable Yield Summary */}
          {totalClaimableYield > 0 && (
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-black flex items-center font-heading">
                  <Gift className="w-5 h-5 mr-2 text-green-600" />
                  Claimable Yield Available
                </CardTitle>
                <CardDescription className="text-gray-600 font-body">
                  You have unclaimed yield ready to be collected
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 font-heading">
                    {formatCurrency(totalClaimableYield)}
                  </div>
                  <p className="text-sm text-gray-600 font-body">
                    From {rwaHoldings.filter(h => h.claimableYield > 0).length} assets
                  </p>
                </div>
                <Button
                  onClick={handleClaimAllYield}
                  disabled={isClaiming}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isClaiming ? 'Claiming...' : 'Claim All Yield'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* RWA Holdings */}
          <div className="space-y-4">
            {rwaHoldings.length > 0 ? (
              rwaHoldings.map((holding) => (
                <Card key={holding.id} className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-black font-heading">{holding.name}</CardTitle>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {holding.type}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatNumber(holding.sharesOwned, 0)} shares owned
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Percent className="w-3 h-3 mr-1" />
                        {holding.expectedYield}% APY
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Current Value</div>
                        <div className="text-lg font-bold text-black font-heading">
                          {formatCurrency(holding.currentValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Yield Earned</div>
                        <div className="text-lg font-bold text-green-600 font-heading">
                          {formatCurrency(holding.yieldEarned)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Claimable Yield</div>
                        <div className="text-lg font-bold text-blue-600 font-heading">
                          {formatCurrency(holding.claimableYield)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Unrealized P&L</div>
                        <div className={`text-lg font-bold font-heading ${
                          holding.currentValue >= holding.purchaseValue ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {holding.currentValue >= holding.purchaseValue ? '+' : ''}
                          {formatCurrency(holding.currentValue - holding.purchaseValue)}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Purchased on {new Date(holding.purchaseDate).toLocaleDateString()}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleClaimYield(holding.id)}
                        disabled={holding.claimableYield <= 0 || isClaiming}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isClaiming ? 'Claiming...' : `Claim ${formatCurrency(holding.claimableYield)}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white border-gray-200">
                <CardContent className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2 font-heading">No RWA Holdings</h3>
                  <p className="text-gray-500 font-body">
                    You haven't invested in any RWA assets yet. Visit the marketplace to start investing.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="yields" className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black font-heading">Yield Performance</CardTitle>
              <CardDescription className="text-gray-600 font-body">
                Track your earnings from mETH staking and RWA investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* mETH Staking Yield */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <span className="text-black font-semibold font-heading">mETH Staking</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {stakingAPY} APY
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Yield:</span>
                      <span className="text-blue-600 font-mono">{formatCurrency(stakingMonthlyYield)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Earned (3mo):</span>
                      <span className="text-blue-600 font-mono">{formatCurrency(stakingMonthlyYield * 3)}</span>
                    </div>
                  </div>
                </div>

                {/* RWA Investment Yield */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      <span className="text-black font-semibold font-heading">RWA Investments</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {rwaAPY}% APY
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Yield:</span>
                      <span className="text-purple-600 font-mono">{formatCurrency(rwaMonthlyYield)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Earned:</span>
                      <span className="text-purple-600 font-mono">{formatCurrency(totalYieldEarned)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black font-heading">Portfolio Allocation</CardTitle>
              <CardDescription className="text-gray-600 font-body">
                Breakdown of your investment distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Token Collateral Allocation */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-black font-semibold font-heading">{tokenSymbol} Collateral</span>
                    <span className="text-black font-mono">
                      {formatNumber((stakedValue / totalPortfolioValue) * 100, 1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(stakedValue / totalPortfolioValue) * 100} 
                    className="h-3 mb-1"
                  />
                  <div className="text-sm text-gray-600 font-mono">
                    {formatCurrency(stakedValue)} of {formatCurrency(totalPortfolioValue)}
                  </div>
                </div>

                {/* RWA Allocation */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-black font-semibold font-heading">RWA Investments</span>
                    <span className="text-black font-mono">
                      {formatNumber((totalRWAValue / totalPortfolioValue) * 100, 1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(totalRWAValue / totalPortfolioValue) * 100} 
                    className="h-3 mb-1"
                  />
                  <div className="text-sm text-gray-600 font-mono">
                    {formatCurrency(totalRWAValue)} of {formatCurrency(totalPortfolioValue)}
                  </div>
                </div>

                {/* Individual RWA Holdings */}
                {rwaHoldings.map((holding) => (
                  <div key={holding.id} className="ml-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-body">{holding.name}</span>
                      <span className="text-gray-700 font-mono">
                        {formatNumber((holding.currentValue / totalPortfolioValue) * 100, 1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(holding.currentValue / totalPortfolioValue) * 100} 
                      className="h-2 mb-1"
                    />
                    <div className="text-xs text-gray-500 font-mono">
                      {formatCurrency(holding.currentValue)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}