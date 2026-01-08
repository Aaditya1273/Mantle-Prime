'use client'

import { useState, useEffect } from 'react'
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
  ArrowDownRight,
  Gift,
  PieChart
} from 'lucide-react'
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
  
  // Mock portfolio data
  const [portfolioData] = useState({
    totalValue: 125000,
    totalInvested: 95000,
    totalGains: 30000,
    totalYieldEarned: 8750,
    claimableYield: 1250,
    mETHStakingYield: 2100,
    rwaYieldEarned: 6650,
    portfolioAPY: 12.5
  })

  const [rwaHoldings] = useState<RWAHolding[]>([
    {
      id: 1,
      name: "Miami Beach Luxury Apartment",
      type: "Real Estate",
      sharesOwned: 300,
      totalShares: 10000,
      pricePerShare: 50,
      currentValue: 16500,
      purchaseValue: 15000,
      expectedYield: 8.0,
      yieldEarned: 1200,
      claimableYield: 400,
      purchaseDate: "2024-01-15",
      lastYieldClaim: "2024-01-01"
    },
    {
      id: 2,
      name: "Corporate Bond Portfolio",
      type: "Private Debt",
      sharesOwned: 200,
      totalShares: 20000,
      pricePerShare: 50,
      currentValue: 10200,
      purchaseValue: 10000,
      expectedYield: 6.5,
      yieldEarned: 650,
      claimableYield: 325,
      purchaseDate: "2024-01-10",
      lastYieldClaim: "2024-01-01"
    },
    {
      id: 3,
      name: "Renewable Energy Project",
      type: "Infrastructure",
      sharesOwned: 150,
      totalShares: 15000,
      pricePerShare: 50,
      currentValue: 8100,
      purchaseValue: 7500,
      expectedYield: 9.2,
      yieldEarned: 690,
      claimableYield: 230,
      purchaseDate: "2024-01-20",
      lastYieldClaim: "2024-01-05"
    },
    {
      id: 4,
      name: "Commercial Real Estate Fund",
      type: "Real Estate",
      sharesOwned: 100,
      totalShares: 40000,
      pricePerShare: 50,
      currentValue: 5250,
      purchaseValue: 5000,
      expectedYield: 7.5,
      yieldEarned: 375,
      claimableYield: 125,
      purchaseDate: "2024-01-05",
      lastYieldClaim: "2024-01-10"
    }
  ])

  const handleClaimYield = async (assetId: number) => {
    console.log(`Claiming yield for asset ${assetId}`)
    // Mock claim transaction
    alert('Yield claimed successfully!')
  }

  const handleClaimAllYield = async () => {
    console.log('Claiming all available yield')
    // Mock claim all transaction
    alert('All yield claimed successfully!')
  }

  const totalRWAValue = rwaHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalRWAInvested = rwaHoldings.reduce((sum, holding) => sum + holding.purchaseValue, 0)
  const totalClaimableYield = rwaHoldings.reduce((sum, holding) => sum + holding.claimableYield, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <PieChart className="w-8 h-8 mr-3" />
            My Portfolio
          </h2>
          <p className="text-gray-300">
            Track your RWA investments and yield earnings
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            {portfolioData.portfolioAPY}% Total APY
          </Badge>
          {totalClaimableYield > 0 && (
            <Button 
              onClick={handleClaimAllYield}
              className="bg-green-600 hover:bg-green-700"
            >
              <Gift className="w-4 h-4 mr-2" />
              Claim All Yield ({formatCurrency(totalClaimableYield)})
            </Button>
          )}
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(portfolioData.totalValue)}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-sm font-semibold">
                +{formatNumber(((portfolioData.totalValue - portfolioData.totalInvested) / portfolioData.totalInvested) * 100, 1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(portfolioData.totalInvested)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Principal amount
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Total Yield Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(portfolioData.totalYieldEarned)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Claimable Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {formatCurrency(portfolioData.claimableYield)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Ready to claim
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Yield Breakdown */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Double Yield Breakdown</CardTitle>
          <CardDescription className="text-gray-300">
            Your combined mETH staking and RWA yield performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* mETH Staking Yield */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">mETH Staking Yield</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  4.2% APY
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Earned This Period:</span>
                  <span className="text-blue-400 font-semibold">
                    {formatCurrency(portfolioData.mETHStakingYield)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Annualized Rate:</span>
                  <span className="text-white">4.2%</span>
                </div>
              </div>
            </div>

            {/* RWA Yield */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">RWA Yield</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  8.3% APY
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Earned This Period:</span>
                  <span className="text-purple-400 font-semibold">
                    {formatCurrency(portfolioData.rwaYieldEarned)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Weighted Average:</span>
                  <span className="text-white">8.3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Performance */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">Combined Performance</h4>
                <p className="text-gray-300 text-sm">Total portfolio APY</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  {portfolioData.portfolioAPY}%
                </div>
                <div className="text-sm text-gray-300">
                  vs {formatNumber(4.2 + 8.3, 1)}% individual rates
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RWA Holdings */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">RWA Holdings</CardTitle>
          <CardDescription className="text-gray-300">
            Your fractional real-world asset investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rwaHoldings.map((holding) => (
              <div key={holding.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{holding.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="border-white/20 text-gray-300">
                        {holding.type}
                      </Badge>
                      <span className="text-gray-400 text-sm">
                        {holding.sharesOwned.toLocaleString()} shares ({formatNumber((holding.sharesOwned / holding.totalShares) * 100, 2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {formatCurrency(holding.currentValue)}
                    </div>
                    <div className={`text-sm flex items-center ${
                      holding.currentValue > holding.purchaseValue ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {holding.currentValue > holding.purchaseValue ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {formatNumber(((holding.currentValue - holding.purchaseValue) / holding.purchaseValue) * 100, 1)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Purchase Value</div>
                    <div className="text-white font-semibold">{formatCurrency(holding.purchaseValue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Expected Yield</div>
                    <div className="text-white font-semibold">{holding.expectedYield}% APY</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Yield Earned</div>
                    <div className="text-green-400 font-semibold">{formatCurrency(holding.yieldEarned)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Claimable</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400 font-semibold">
                        {formatCurrency(holding.claimableYield)}
                      </span>
                      {holding.claimableYield > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleClaimYield(holding.id)}
                          className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Purchased: {new Date(holding.purchaseDate).toLocaleDateString()}</span>
                    <span>Last Claim: {new Date(holding.lastYieldClaim).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Asset Allocation */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Asset Allocation</CardTitle>
            <CardDescription className="text-gray-300">
              Portfolio distribution by asset type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                rwaHoldings.reduce((acc, holding) => {
                  acc[holding.type] = (acc[holding.type] || 0) + holding.currentValue
                  return acc
                }, {} as Record<string, number>)
              ).map(([type, value]) => {
                const percentage = (value / totalRWAValue) * 100
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{type}</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(value)} ({formatNumber(percentage, 1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Yield Summary */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Yield Summary</CardTitle>
            <CardDescription className="text-gray-300">
              Monthly yield performance breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div>
                  <div className="text-blue-300 font-semibold">mETH Staking</div>
                  <div className="text-blue-400 text-sm">4.2% APY</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{formatCurrency(portfolioData.mETHStakingYield)}</div>
                  <div className="text-blue-300 text-sm">This month</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div>
                  <div className="text-purple-300 font-semibold">RWA Yields</div>
                  <div className="text-purple-400 text-sm">8.3% Weighted APY</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{formatCurrency(portfolioData.rwaYieldEarned)}</div>
                  <div className="text-purple-300 text-sm">This month</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div>
                  <div className="text-green-300 font-semibold">Total Yield</div>
                  <div className="text-green-400 text-sm">{portfolioData.portfolioAPY}% Combined APY</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatCurrency(portfolioData.mETHStakingYield + portfolioData.rwaYieldEarned)}
                  </div>
                  <div className="text-green-300 text-sm">This month</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}