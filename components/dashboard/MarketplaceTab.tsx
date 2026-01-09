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
  const { address } = useAccount()
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')

  // Real contract data with safe fallbacks
  const creditTokenResult = useCreditToken(address)
  const creditBalance = creditTokenResult?.balance || '0'
  
  const marketplaceResult = useRWAMarketplace(address)
  const buyShares = marketplaceResult?.buyShares || (async () => '0x123')
  const isPurchasing = marketplaceResult?.isPurchasing || false

  // RWA assets data
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
      description: "Premium oceanfront apartment in South Beach with guaranteed rental income and appreciation potential.",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      creator: "Miami Real Estate Fund",
      features: ["Oceanfront", "Luxury Amenities", "Prime Location", "Rental Guaranteed"],
      riskLevel: "Medium"
    }
  ]

  const userBalance = creditBalance ? parseFloat(creditBalance) * 0.95 : 0

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true
    return asset.type.toLowerCase().includes(filter.toLowerCase())
  })

  const handlePurchase = async (asset: RWAAsset, shares: number) => {
    if (!shares || shares <= 0) return
    
    try {
      const requiredAmount = asset.pricePerShare * shares
      const userBalanceNum = parseFloat(creditBalance)
      
      if (userBalanceNum < requiredAmount) {
        toast({
          title: "❌ Insufficient Balance",
          description: `You need ${formatCurrency(requiredAmount)} USDY but only have ${formatCurrency(userBalanceNum)} USDY.`,
          variant: "destructive",
        })
        return
      }

      const txHash = await buyShares(asset.id, shares)
      
      if (txHash && txHash !== '0x123') {
        const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`
        const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
        
        toast({
          title: "✅ RWA Purchase Successful",
          description: `Successfully purchased ${shares} shares of ${asset.name}. Transaction: ${shortHash}`,
          duration: 8000,
        })

        console.log(`Explorer Link: ${explorerUrl}`)
      } else {
        throw new Error('Invalid transaction hash received')
      }
      
    } catch (error: any) {
      console.error('Purchase failed:', error)
      
      toast({
        title: "❌ RWA Purchase Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
        duration: 8000,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center">
            <Building className="w-8 h-8 mr-3" />
            RWA Marketplace
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
                      duration: 8000,
                    })
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>

                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePurchase(asset, 1)}
                  disabled={asset.availableShares === 0 || userBalance < asset.pricePerShare || isPurchasing}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {isPurchasing ? 'Buying...' : 'Buy 1 Share'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Assets Found</h3>
          <p className="text-gray-500">
            No assets match your current filter. Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  )
}