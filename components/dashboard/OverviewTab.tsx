'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Building, 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Shield,
  AlertCircle
} from 'lucide-react'

export default function OverviewTab() {
  const { address } = useAccount()
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 125000,
    mETHDeposited: 50,
    creditUsed: 75000,
    rwaInvestments: 45000,
    totalYield: 12.5,
    healthFactor: 1.67,
    mETHYield: 4.2,
    rwaYield: 8.3
  })

  // Mock data - replace with real contract calls
  const quickStats = [
    {
      title: "Total Portfolio Value",
      value: `$${portfolioData.totalValue.toLocaleString()}`,
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "Combined mETH + RWA value"
    },
    {
      title: "mETH Deposited", 
      value: `${portfolioData.mETHDeposited} mETH`,
      change: "+2.1%",
      changeType: "positive", 
      icon: Wallet,
      description: "Earning staking rewards"
    },
    {
      title: "Credit Utilized",
      value: `$${portfolioData.creditUsed.toLocaleString()}`,
      change: "75%",
      changeType: "neutral",
      icon: CreditCard,
      description: "Of available credit line"
    },
    {
      title: "RWA Investments",
      value: `$${portfolioData.rwaInvestments.toLocaleString()}`,
      change: "+8.3%",
      changeType: "positive",
      icon: Building,
      description: "Across 5 assets"
    }
  ]

  const recentActivity = [
    {
      type: "deposit",
      description: "Deposited 10 mETH to vault",
      amount: "+10 mETH",
      time: "2 hours ago",
      status: "completed"
    },
    {
      type: "credit",
      description: "Issued USDY credit line",
      amount: "+$25,000 USDY",
      time: "3 hours ago", 
      status: "completed"
    },
    {
      type: "purchase",
      description: "Purchased Miami Beach Apartment shares",
      amount: "-$15,000 USDY",
      time: "5 hours ago",
      status: "completed"
    },
    {
      type: "yield",
      description: "Claimed RWA yield distribution",
      amount: "+$312.50",
      time: "1 day ago",
      status: "completed"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-300">
            Here's your Mantle Prime portfolio overview
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Healthy Position
          </Badge>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-400' : 
                  stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {stat.changeType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                  {stat.changeType === 'negative' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Yield Overview */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Double Yield Performance
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your combined mETH staking + RWA yields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total APY */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10">
              <div className="text-4xl font-bold text-white mb-2">
                {portfolioData.totalYield}%
              </div>
              <div className="text-sm text-gray-300 mb-4">Total APY</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-400 font-semibold">{portfolioData.mETHYield}%</div>
                  <div className="text-gray-400">mETH Staking</div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold">{portfolioData.rwaYield}%</div>
                  <div className="text-gray-400">RWA Yields</div>
                </div>
              </div>
            </div>

            {/* Health Factor */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Health Factor</span>
                <span className="text-sm font-semibold text-green-400">
                  {portfolioData.healthFactor}x
                </span>
              </div>
              <Progress 
                value={Math.min((portfolioData.healthFactor / 2) * 100, 100)} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">
                Liquidation risk at 1.2x. Current position is healthy.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-3">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Deposit mETH
              </Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                Issue Credit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-300">
              Your latest transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                  <div className={`text-sm font-semibold ${
                    activity.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {activity.amount}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-gray-400 hover:text-white">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management Alert */}
      <Card className="bg-yellow-500/10 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="flex items-center space-x-3 pt-6">
          <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-200 font-medium">
              Portfolio Health Check
            </p>
            <p className="text-xs text-yellow-300/80">
              Your position is healthy with a {portfolioData.healthFactor}x health factor. 
              Consider rebalancing if it drops below 1.5x.
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}