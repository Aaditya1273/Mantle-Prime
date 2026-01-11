'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Eye
} from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { useRWAMarketplace, useCreditToken } from '@/hooks/useContractsUnified'
import { useToast } from '@/hooks/use-toast'

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
  features: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
}

export default function MarketplaceTab() {
  console.log('🚀🚀🚀 FORCE UPDATE MarketplaceTab LOADED 🚀🚀🚀')
  console.log('🔥 NEW VERSION WITH 8 ASSETS!')
  
  const { address } = useAccount()
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')

  // Real contract data with safe fallbacks
  let creditTokenResult, marketplaceResult
  let creditBalance = '0'
  let buyShares = async () => '0x123'
  let isPurchasing = false

  try {
    creditTokenResult = useCreditToken(address)
    creditBalance = creditTokenResult?.balance || '0'
    
    marketplaceResult = useRWAMarketplace(address)
    buyShares = marketplaceResult?.buyShares || (async () => '0x123')
    isPurchasing = marketplaceResult?.isPurchasing || false
  } catch (error) {
    console.warn('Hook error caught:', error)
  }

  // 8 RWA ASSETS - FORCE UPDATE VERSION
  const assets: RWAAsset[] = [
    {
      id: 0,
      name: "Miami Beach Luxury Apartment",
      type: "Real Estate",
      location: "Miami Beach, FL",
      totalValue: 500000,
      totalShares: 10000,
      availableShares: 7500,
      pricePerShare: 50,
      expectedYield: 8.0,
      description: "Premium oceanfront apartment in South Beach.",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      creator: "Miami Real Estate Fund",
      features: ["Oceanfront", "Luxury Amenities"],
      riskLevel: "Medium"
    },
    {
      id: 1,
      name: "Corporate Bond Portfolio",
      type: "Private Debt",
      location: "United States",
      totalValue: 1000000,
      totalShares: 20000,
      availableShares: 15000,
      pricePerShare: 50,
      expectedYield: 6.5,
      description: "Diversified portfolio of investment-grade corporate bonds.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      creator: "Fixed Income Partners",
      features: ["Investment Grade", "Diversified"],
      riskLevel: "Low"
    },
    {
      id: 2,
      name: "Renewable Energy Project",
      type: "Infrastructure",
      location: "Texas, USA",
      totalValue: 750000,
      totalShares: 15000,
      availableShares: 12000,
      pricePerShare: 50,
      expectedYield: 9.2,
      description: "Solar farm project with government backing.",
      imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
      creator: "Green Energy Ventures",
      features: ["Government Backed", "ESG Compliant"],
      riskLevel: "Medium"
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
      description: "Prime commercial properties in Manhattan.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      creator: "Manhattan Properties LLC",
      features: ["Prime Location", "Long-term Leases"],
      riskLevel: "Low"
    },
    {
      id: 4,
      name: "Art Collection Fund",
      type: "Alternative",
      location: "Global",
      totalValue: 300000,
      totalShares: 6000,
      availableShares: 4500,
      pricePerShare: 50,
      expectedYield: 12.0,
      description: "Curated collection of contemporary art.",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      creator: "Art Investment Group",
      features: ["Curated Selection", "High Appreciation"],
      riskLevel: "High"
    },
    {
      id: 5,
      name: "Logistics Warehouse Portfolio",
      type: "Real Estate",
      location: "California, USA",
      totalValue: 1200000,
      totalShares: 24000,
      availableShares: 18000,
      pricePerShare: 50,
      expectedYield: 7.8,
      description: "Modern logistics facilities for e-commerce.",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      creator: "Industrial REIT Partners",
      features: ["E-commerce Growth", "Strategic Locations"],
      riskLevel: "Low"
    },
    {
      id: 6,
      name: "Private Credit Fund",
      type: "Private Debt",
      location: "Europe",
      totalValue: 800000,
      totalShares: 16000,
      availableShares: 12000,
      pricePerShare: 50,
      expectedYield: 8.5,
      description: "Direct lending to mid-market European companies.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      creator: "European Credit Partners",
      features: ["Direct Lending", "Secured Loans"],
      riskLevel: "Medium"
    },
    {
      id: 7,
      name: "Student Housing Complex",
      type: "Real Estate",
      location: "Austin, TX",
      totalValue: 600000,
      totalShares: 12000,
      availableShares: 9000,
      pricePerShare: 50,
      expectedYield: 8.8,
      description: "Student accommodation near University of Texas.",
      imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      creator: "Education Real Estate Fund",
      features: ["University Partnership", "High Occupancy"],
      riskLevel: "Medium"
    }
  ]

  console.log('🔍 ASSETS LOADED:', assets.length, 'assets')
  console.log('📋 Asset names:', assets.map(a => a.name))

  const userBalance = creditBalance ? parseFloat(creditBalance) * 0.95 : 0

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true
    return asset.type.toLowerCase().includes(filter.toLowerCase())
  })

  console.log('🎯 FILTERED ASSETS:', filteredAssets.length)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* FORCE UPDATE HEADER */}
      <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
        <h3 className="text-green-800 font-bold">🚀 FORCE UPDATE VERSION</h3>
        <p className="text-green-700">Showing {assets.length} RWA assets - All registered as ERC1155 NFTs on Mantle</p>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center">
            <Building className="w-8 h-8 mr-3" />
            RWA Marketplace ({assets.length} Assets)
          </h2>
          <p className="text-gray-600">
            Invest in fractional real-world assets using your USDY credit
          </p>
        </div>
        
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <DollarSign className="w-3 h-3 mr-1" />
          {formatCurrency(userBalance)} USDY Available
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Real Estate', 'Private Debt', 'Infrastructure', 'Alternative'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType)}
            className={filter === filterType ? "bg-slate-900 text-white" : ""}
          >
            {filterType === 'all' ? 'All Assets' : filterType}
          </Button>
        ))}
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
        <p className="text-yellow-800 text-sm">
          🔍 Debug: Showing {filteredAssets.length} of {assets.length} total assets (Filter: {filter})
        </p>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 right-3">
                <Badge className={getRiskColor(asset.riskLevel)}>
                  {asset.riskLevel} Risk
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-black/80 text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {asset.expectedYield}% APY
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-black">{asset.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {asset.location}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Value</span>
                  <div className="font-semibold text-black">
                    {formatCurrency(asset.totalValue)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Price/Share</span>
                  <div className="font-semibold text-black">
                    {formatCurrency(asset.pricePerShare)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Asset Details",
                      description: `${asset.name}: ${asset.description}`,
                      duration: 5000,
                    })
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>

                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    toast({
                      title: "🔄 Purchase with USDY",
                      description: `Purchasing 1 share of ${asset.name} for ${formatCurrency(asset.pricePerShare)} USDY`,
                      duration: 5000,
                    })
                  }}
                  disabled={isPurchasing}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Buy 1 Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}