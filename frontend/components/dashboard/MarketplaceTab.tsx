'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { CONTRACTS, TOKENS, RWA_MARKETPLACE_ABI, ERC20_ABI } from '@/lib/wagmi'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Building, 
  MapPin, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Shield,
  Star,
  ShoppingCart,
  Eye
} from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface RWAAsset {
  id: number
  name: string
  type: string
  location: string
  totalValue: number
  totalShares: number
  availableShares: number
  pricePerShare: number
  expectedYield: number
  description: string
  imageUrl: string
  creator: string
  createdAt: string
  features: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
}

export default function MarketplaceTab() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [selectedAsset, setSelectedAsset] = useState<RWAAsset | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [filter, setFilter] = useState('all')

  // Mock RWA assets data
  const [assets] = useState<RWAAsset[]>([
    {
      id: 1,
      name: "Miami Beach Luxury Apartment",
      type: "Real Estate",
      location: "Miami Beach, FL",
      totalValue: 500000,
      totalShares: 10000,
      availableShares: 7500,
      pricePerShare: 50,
      expectedYield: 8.0,
      description: "Premium oceanfront apartment in South Beach with guaranteed rental income and appreciation potential.",
      imageUrl: "/api/placeholder/400/300",
      creator: "Miami Real Estate Fund",
      createdAt: "2024-01-15",
      features: ["Oceanfront", "Luxury Amenities", "Prime Location", "Rental Guaranteed"],
      riskLevel: "Medium"
    },
    {
      id: 2,
      name: "Corporate Bond Portfolio",
      type: "Private Debt",
      location: "United States",
      totalValue: 1000000,
      totalShares: 20000,
      availableShares: 15000,
      pricePerShare: 50,
      expectedYield: 6.5,
      description: "Diversified portfolio of investment-grade corporate bonds with stable returns.",
      imageUrl: "/api/placeholder/400/300",
      creator: "Fixed Income Partners",
      createdAt: "2024-01-10",
      features: ["Investment Grade", "Diversified", "Stable Returns", "Quarterly Payments"],
      riskLevel: "Low"
    },
    {
      id: 3,
      name: "Commercial Real Estate Fund",
      type: "Real Estate",
      location: "New York, NY",
      totalValue: 2000000,
      totalShares: 40000,
      availableShares: 25000,
      pricePerShare: 50,
      expectedYield: 7.5,
      description: "Prime commercial properties in Manhattan with long-term lease agreements.",
      imageUrl: "/api/placeholder/400/300",
      creator: "NYC Property Group",
      createdAt: "2024-01-05",
      features: ["Prime Location", "Long-term Leases", "Stable Tenants", "Appreciation Potential"],
      riskLevel: "Medium"
    },
    {
      id: 4,
      name: "Renewable Energy Project",
      type: "Infrastructure",
      location: "Texas, USA",
      totalValue: 750000,
      totalShares: 15000,
      availableShares: 12000,
      pricePerShare: 50,
      expectedYield: 9.2,
      description: "Solar farm project with 20-year power purchase agreement and government incentives.",
      imageUrl: "/api/placeholder/400/300",
      creator: "Green Energy Ventures",
      createdAt: "2024-01-20",
      features: ["Government Backed", "20-Year Contract", "ESG Compliant", "Tax Benefits"],
      riskLevel: "Medium"
    },
    {
      id: 5,
      name: "Art Collection Fund",
      type: "Alternative Assets",
      location: "Global",
      totalValue: 300000,
      totalShares: 6000,
      availableShares: 4500,
      pricePerShare: 50,
      expectedYield: 12.0,
      description: "Curated collection of contemporary art with strong appreciation history.",
      imageUrl: "/api/placeholder/400/300",
      creator: "Art Investment LLC",
      createdAt: "2024-01-25",
      features: ["Curated Selection", "Expert Management", "High Appreciation", "Liquid Market"],
      riskLevel: "High"
    },
    {
      id: 6,
      name: "Agricultural Land Investment",
      type: "Real Estate",
      location: "Iowa, USA",
      totalValue: 600000,
      totalShares: 12000,
      availableShares: 8000,
      pricePerShare: 50,
      expectedYield: 5.8,
      description: "Prime farmland with sustainable farming practices and commodity exposure.",
      imageUrl: "/api/placeholder/400/300",
      creator: "AgriLand Partners",
      createdAt: "2024-01-12",
      features: ["Sustainable Farming", "Commodity Exposure", "Land Appreciation", "ESG Focused"],
      riskLevel: "Low"
    }
  ])

  const [userBalance] = useState(25000) // Mock USDY balance

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true
    if (filter === 'real-estate') return asset.type === 'Real Estate'
    if (filter === 'debt') return asset.type === 'Private Debt'
    if (filter === 'alternative') return asset.type === 'Alternative Assets' || asset.type === 'Infrastructure'
    return true
  })

  const handlePurchase = async (asset: RWAAsset, shares: number) => {
    setIsPurchasing(true)
    try {
      console.log(`Purchasing ${shares} shares of ${asset.name}`)
      
      // Mock transaction
      setTimeout(() => {
        // Update available shares
        const updatedAssets = assets.map(a => 
          a.id === asset.id 
            ? { ...a, availableShares: a.availableShares - shares }
            : a
        )
        
        setIsPurchasing(false)
        setSelectedAsset(null)
        setPurchaseAmount('')
        
        toast({
          title: "Purchase Successful",
          description: `Successfully purchased ${shares} shares of ${asset.name}`,
          variant: "success",
        })
      }, 2000)

    } catch (error) {
      console.error('Purchase failed:', error)
      setIsPurchasing(false)
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase shares. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Building className="w-8 h-8 mr-3" />
            RWA Marketplace
          </h2>
          <p className="text-gray-300">
            Purchase fractional shares of tokenized real-world assets
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <DollarSign className="w-3 h-3 mr-1" />
            {formatCurrency(userBalance)} USDY Available
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: 'All Assets' },
          { id: 'real-estate', label: 'Real Estate' },
          { id: 'debt', label: 'Private Debt' },
          { id: 'alternative', label: 'Alternative' }
        ].map((filterOption) => (
          <Button
            key={filterOption.id}
            variant={filter === filterOption.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.id)}
            className={filter === filterOption.id 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {filterOption.label}
          </Button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-white/5 border-white/10 backdrop-blur-sm card-hover overflow-hidden">
            {/* Asset Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building className="w-16 h-16 text-white/50" />
              </div>
              <div className="absolute top-3 left-3">
                <Badge className={getRiskColor(asset.riskLevel)}>
                  {asset.riskLevel} Risk
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  {asset.expectedYield}% APY
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-1">{asset.name}</CardTitle>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {asset.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline" className="border-white/20 text-gray-300">
                  {asset.type}
                </Badge>
                <span className="text-gray-400">by {asset.creator}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm line-clamp-2">
                {asset.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Price per Share</div>
                  <div className="text-white font-semibold">{formatCurrency(asset.pricePerShare)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Available</div>
                  <div className="text-white font-semibold">
                    {asset.availableShares.toLocaleString()} / {asset.totalShares.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {asset.features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-gray-300">
                    {feature}
                  </Badge>
                ))}
                {asset.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300">
                    +{asset.features.length - 2} more
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{asset.name}</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        {asset.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Asset Details */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Investment Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Value:</span>
                                <span className="text-white">{formatCurrency(asset.totalValue)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Expected Yield:</span>
                                <span className="text-green-400">{asset.expectedYield}% APY</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Risk Level:</span>
                                <Badge className={getRiskColor(asset.riskLevel)}>
                                  {asset.riskLevel}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Share Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Price per Share:</span>
                                <span className="text-white">{formatCurrency(asset.pricePerShare)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Available Shares:</span>
                                <span className="text-white">{asset.availableShares.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Shares:</span>
                                <span className="text-white">{asset.totalShares.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-white mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {asset.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="bg-white/10 text-gray-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Purchase Section */}
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="font-semibold text-white mb-4">Purchase Shares</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="purchase-shares" className="text-gray-300">
                              Number of Shares
                            </Label>
                            <Input
                              id="purchase-shares"
                              type="number"
                              placeholder="0"
                              value={purchaseAmount}
                              onChange={(e) => setPurchaseAmount(e.target.value)}
                              className="bg-white/5 border-white/20 text-white"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Total Cost: {purchaseAmount ? formatCurrency(parseFloat(purchaseAmount) * asset.pricePerShare) : '$0.00'}
                              </span>
                              <span className="text-gray-400">
                                Balance: {formatCurrency(userBalance)} USDY
                              </span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => handlePurchase(asset, parseInt(purchaseAmount))}
                            disabled={!purchaseAmount || parseInt(purchaseAmount) <= 0 || parseInt(purchaseAmount) > asset.availableShares || isPurchasing}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            {isPurchasing ? 'Purchasing...' : 'Purchase Shares'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setSelectedAsset(asset)
                    setPurchaseAmount('100') // Default to 100 shares
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Stats */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Marketplace Statistics</CardTitle>
          <CardDescription className="text-gray-300">
            Overview of the RWA marketplace performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {assets.length}
              </div>
              <div className="text-gray-400 text-sm">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {formatCurrency(assets.reduce((sum, asset) => sum + asset.totalValue, 0))}
              </div>
              <div className="text-gray-400 text-sm">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(assets.reduce((sum, asset) => sum + asset.expectedYield, 0) / assets.length, 1)}%
              </div>
              <div className="text-gray-400 text-sm">Avg. Yield</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {assets.reduce((sum, asset) => sum + (asset.totalShares - asset.availableShares), 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Shares Sold</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}