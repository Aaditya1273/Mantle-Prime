'use client'

import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { LogoWithText } from '@/components/ui/logo'
import {
  Home,
  Wallet,
  CreditCard,
  Building,
  TrendingUp,
  Settings,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Shield,
  AlertCircle
} from 'lucide-react'

// Import tab components
import OverviewTab from '@/components/dashboard/OverviewTab'
import VaultTab from '@/components/dashboard/VaultTab'
import CreditTab from '@/components/dashboard/CreditTab'
import MarketplaceTab from '@/components/dashboard/MarketplaceTab'
import PortfolioTab from '@/components/dashboard/PortfolioTab'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isConnected && mounted) {
      router.push('/')
    }
  }, [isConnected, mounted, router])

  if (!mounted || !isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-96 bg-white border border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-black">Connect Wallet</CardTitle>
            <CardDescription className="text-gray-600">
              Please connect your wallet to access Mantle Prime
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'vault', label: 'Vault', icon: Wallet },
    { id: 'credit', label: 'Credit Lines', icon: CreditCard },
    { id: 'marketplace', label: 'RWA Marketplace', icon: Building },
    { id: 'portfolio', label: 'My Portfolio', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <LogoWithText size="md" />

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Mantle Network
              </Badge>

              {/* Wallet Info */}
              <div className="text-right">
                <p className="text-sm text-black font-medium">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <p className="text-xs text-gray-600">Connected</p>
              </div>

              {/* Connect Button */}
              <ConnectButton />

              {/* Settings & Logout */}
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-black"
                  onClick={() => disconnect()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 border border-gray-200">
            {navigationItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex items-center space-x-2 data-[state=active]:bg-black data-[state=active]:text-white text-gray-700"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="vault" className="space-y-6">
              <VaultTab />
            </TabsContent>

            <TabsContent value="credit" className="space-y-6">
              <CreditTab />
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-6">
              <MarketplaceTab />
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <PortfolioTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>© 2026 Mantle Prime</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Built on Mantle Network</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-black transition-colors">Docs</a>
              <a href="#" className="hover:text-black transition-colors">Support</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}