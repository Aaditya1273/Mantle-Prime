'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TransactionModal } from '@/components/ui/transaction-modal'
import { 
  Building, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Eye
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'
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

export default function MarketplaceTabV3() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')
  const [purchaseShares, setPurchaseShares] = useState(1)
  
  // Transaction modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    success: false,
    title: '',
    message: '',
    txHash: '',
    explorerUrl: ''
  })

  // Real contract data with safe fallbacks
  let creditTokenResult: any = null
  let marketplaceResult: any = null
  let creditBalance = '0'
  let buyShares: (assetId: number, shares: number) => Promise<string> = async (_assetId: number, _shares: number) => {
    throw new Error('Contract not connected. Please check your wallet connection.')
  }
  let isPurchasing = false

  try {
    creditTokenResult = useCreditToken(address)
    creditBalance = creditTokenResult?.balance || '0'
    
    marketplaceResult = useRWAMarketplace(address)
    buyShares = marketplaceResult?.buyShares || buyShares // Keep the error-throwing fallback
    isPurchasing = marketplaceResult?.isPurchasing || false
  } catch (error) {
    console.warn('Hook error caught:', error)
  }

  // Fetch live data for all assets
  const asset0Data = marketplaceResult?.getAssetInfo(0)
  const asset1Data = marketplaceResult?.getAssetInfo(1)
  const asset2Data = marketplaceResult?.getAssetInfo(2)
  const asset3Data = marketplaceResult?.getAssetInfo(3)
  const asset4Data = marketplaceResult?.getAssetInfo(4)
  const asset5Data = marketplaceResult?.getAssetInfo(5)
  const asset6Data = marketplaceResult?.getAssetInfo(6)
  const asset7Data = marketplaceResult?.getAssetInfo(7)

  // Static asset data for display (images, descriptions, etc.)
  const staticAssetData = [
    {
      id: 0,
      name: "Miami Beach Luxury Apartment",
      type: "Real Estate",
      location: "Miami Beach, FL",
      totalValue: 500000,
      description: "Premium oceanfront apartment in South Beach.",
      imageUrl: "https://ap.rdcpix.com/e66a778a2a9f267f660069148eef566al-m3143752556rd-w960_h720.jpg?cache=v3",
      creator: "Miami Real Estate Fund",
      features: ["Oceanfront", "Luxury Amenities"],
      riskLevel: "Medium" as const,
      liveData: asset0Data
    },
    {
      id: 1,
      name: "Corporate Bond Portfolio",
      type: "Private Debt",
      location: "United States",
      totalValue: 1000000,
      description: "Diversified portfolio of investment-grade corporate bonds.",
      imageUrl: "https://www.invesco.com/content/dam/invesco/emea/en/images/fixed-income-campaign/desktop/global-investment-grade-corporate-bond-hero-banner.jpg",
      creator: "Fixed Income Partners",
      features: ["Investment Grade", "Diversified"],
      riskLevel: "Low" as const,
      liveData: asset1Data
    },
    {
      id: 2,
      name: "Renewable Energy Project",
      type: "Infrastructure",
      location: "Texas, USA",
      totalValue: 750000,
      description: "Solar farm project with government backing.",
      imageUrl: "https://t4.ftcdn.net/jpg/01/72/95/67/360_F_172956774_RK63V0pMmJC3AcGa0x6yylYMCC2pahzs.jpg",
      creator: "Green Energy Ventures",
      features: ["Government Backed", "ESG Compliant"],
      riskLevel: "Medium" as const,
      liveData: asset2Data
    },
    {
      id: 3,
      name: "Commercial Real Estate Fund",
      type: "Real Estate",
      location: "New York, NY",
      totalValue: 2000000,
      description: "Prime commercial properties in Manhattan.",
      imageUrl: "https://media.istockphoto.com/id/1944442050/photo/illuminated-office-buildings-in-london-at-night.jpg?s=612x612&w=0&k=20&c=bR8loWI6Kdk4x3JOg4m3tDgaJHk26mKlQnp8mUiXxRc=",
      creator: "Manhattan Properties LLC",
      features: ["Prime Location", "Long-term Leases"],
      riskLevel: "Low" as const,
      liveData: asset3Data
    },
    {
      id: 4,
      name: "Japanese Art Collection Fund",
      type: "Alternative",
      location: "Global",
      totalValue: 300000,
      description: "Curated collection of contemporary art.",
      imageUrl: "https://images-cdn.ubuy.co.in/693ed1254259f9c8590ebbfe-lyerartork-4-panel-japanese-ink-painting.jpg",
      creator: "Art Investment Group",
      features: ["Curated Selection", "High Appreciation"],
      riskLevel: "High" as const,
      liveData: asset4Data
    },
    {
      id: 5,
      name: "Logistics Warehouse Portfolio",
      type: "Real Estate",
      location: "California, USA",
      totalValue: 1200000,
      description: "Modern logistics facilities for e-commerce.",
      imageUrl: "https://t4.ftcdn.net/jpg/16/30/89/73/360_F_1630897372_tQTSEYqscEoiguyHJlXLxbnnBaTZnL3K.jpg",
      creator: "Industrial REIT Partners",
      features: ["E-commerce Growth", "Strategic Locations"],
      riskLevel: "Low" as const,
      liveData: asset5Data
    },
    {
      id: 6,
      name: "Private Credit Fund",
      type: "Private Debt",
      location: "Europe",
      totalValue: 800000,
      description: "Direct lending to mid-market European companies.",
      imageUrl: "https://www.ey.com/content/dam/ey-unified-site/ey-com/en-in/insights/strategy-transactions/images/ey-private-credit-in-india.png",
      creator: "European Credit Partners",
      features: ["Direct Lending", "Secured Loans"],
      riskLevel: "Medium" as const,
      liveData: asset6Data
    },
    {
      id: 7,
      name: "Student Housing Complex",
      type: "Real Estate",
      location: "Austin, TX",
      totalValue: 600000,
      description: "Student accommodation near University of Texas.",
      imageUrl: "https://www.iqstudentaccommodation.com/sites/default/files/styles/default/public/2021-09/iQ-Student-Accommodation-Leeds-Altus-House-Floors-3-5-10-Bronze_En_Suite%285%29.jpg?itok=f3AabbPL",
      creator: "Education Real Estate Fund",
      features: ["University Partnership", "High Occupancy"],
      riskLevel: "Medium" as const,
      liveData: asset7Data
    }
  ]

  // Create combined assets with live blockchain data
  const assets: RWAAsset[] = staticAssetData.map((staticData) => {
    const liveData = staticData.liveData
    
    return {
      ...staticData,
      totalShares: liveData?.data ? Number(liveData.data[1]) : 10000,
      availableShares: liveData?.data ? Number(liveData.data[2]) : 10000,
      pricePerShare: liveData?.data ? Number(liveData.data[3]) / 1e18 : 50,
      expectedYield: liveData?.data ? Number(liveData.data[4]) / 100 : 8.0,
    }
  })

  const userBalance = creditBalance ? parseFloat(creditBalance) * 0.95 : 0

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true
    return asset.type.toLowerCase().includes(filter.toLowerCase())
  })

  const handlePurchase = async (asset: RWAAsset, shares: number) => {
    // Validate input - prevent 0 or negative shares
    if (!shares || shares <= 0 || isNaN(shares)) {
      setModalState({
        isOpen: true,
        success: false,
        title: 'Invalid Input',
        message: 'Please enter a valid number of shares (greater than 0).',
        txHash: '',
        explorerUrl: ''
      })
      return
    }
    
    try {
      const requiredAmount = asset.pricePerShare * shares
      const userBalanceNum = parseFloat(creditBalance)
      
      console.log(`🔍 Debug: Required amount: ${requiredAmount}, User balance: ${userBalanceNum}`)
      console.log(`🔍 Debug: Asset ID: ${asset.id}, Shares: ${shares}`)
      
      // Check balance
      if (userBalanceNum < requiredAmount) {
        setModalState({
          isOpen: true,
          success: false,
          title: 'Insufficient USDY Balance',
          message: `You need ${requiredAmount} USDY but only have ${formatNumber(userBalanceNum, 0)} USDY. Get more USDY from the Credit tab first.`,
          txHash: '',
          explorerUrl: ''
        })
        return
      }

      // Show processing message
      toast({
        title: "🔄 Processing RWA Purchase",
        description: `Step 1/2: Approving USDY spending for ${requiredAmount} USDY. Please confirm in your wallet...`,
        duration: 5000,
      })

      // Step 1: Approve USDY spending
      const marketplaceAddress = process.env.NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS || "0x101190D8AcF4b5D4C01b60BFFc222FD3FD6E64a2"
      
      console.log(`🔍 Debug: Marketplace address: ${marketplaceAddress}`)
      console.log(`🔍 Debug: Credit token result:`, creditTokenResult)
      
      if (!creditTokenResult?.approveToken) {
        throw new Error('Approve function not available. Please make sure you have USDY tokens.')
      }
      
      const approveResult = await creditTokenResult.approveToken(marketplaceAddress as any, requiredAmount.toString())
      console.log(`🔍 Debug: Approve result:`, approveResult)
      
      if (!approveResult) {
        throw new Error('Failed to approve USDY spending')
      }

      // Show purchase step
      toast({
        title: "� Pr ocessing RWA Purchase",
        description: `Step 2/2: Purchasing ${shares} shares of ${asset.name}. Please confirm in your wallet...`,
        duration: 5000,
      })

      // Step 2: Execute purchase transaction
      console.log(`🔍 Debug: Calling buyShares with asset ID: ${asset.id}, shares: ${shares}`)
      const txHash = await buyShares(asset.id, shares)
      console.log(`🔍 Debug: Transaction hash:`, txHash)
      
      // Strict transaction validation - reject any invalid hashes
      if (!txHash || typeof txHash !== 'string') {
        throw new Error(`Invalid transaction hash received: ${txHash}. Transaction likely failed.`)
      }
      
      if (txHash === '0x123' || txHash === '0x' || !txHash.startsWith('0x') || txHash.length !== 66) {
        throw new Error(`Invalid transaction hash format: ${txHash}. Transaction likely failed.`)
      }
      
      // Valid transaction hash received
      const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`
      
      setModalState({
        isOpen: true,
        success: true,
        title: 'RWA Purchase Successful!',
        message: `Successfully purchased ${shares} shares of ${asset.name} for ${requiredAmount} USDY. You're now earning ${asset.expectedYield}% APY!`,
        txHash: txHash,
        explorerUrl: explorerUrl
      })

      console.log(`✅ RWA Purchase Successful - ${requiredAmount} USDY spent`)
      console.log(`🎯 Portfolio Updated: +${shares} shares of ${asset.name}`)
      console.log(`Explorer Link: ${explorerUrl}`)
      
      // Refresh the page to show updated available shares
      setTimeout(() => {
        window.location.reload()
      }, 3000)
      
    } catch (error: any) {
      console.error('Purchase failed:', error)
      
      // Show specific error message
      let errorMessage = "Transaction failed. Please try again."
      
      if (error?.message?.includes('User rejected') || error?.message?.includes('user rejected')) {
        errorMessage = "Transaction was cancelled by user."
      } else if (error?.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction."
      } else if (error?.message?.includes('approve') || error?.message?.includes('allowance')) {
        errorMessage = "Failed to approve USDY spending. Please try again."
      } else if (error?.message?.includes('execution reverted')) {
        errorMessage = "Transaction reverted. Check your USDY balance and try again."
      } else if (error?.message?.includes('Approve function not available')) {
        errorMessage = "Please get USDY tokens from the Credit tab first."
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setModalState({
        isOpen: true,
        success: false,
        title: 'RWA Purchase Failed',
        message: errorMessage,
        txHash: '',
        explorerUrl: ''
      })
    }
  }

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
      {/* Clean Header - NO BANNERS */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center">
            <Building className="w-8 h-8 mr-3" />
            RWA Marketplace
          </h2>
          <p className="text-gray-600 mb-2">
            Invest in fractional real-world assets using your USDY credit
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>🏛️ {assets.length} RWA Assets Available</span>
            <span>🔗 Registered as ERC1155 NFTs on Mantle Sepolia Testnet</span>
            <span>🪙 Payments via USDY Token</span>
          </div>
        </div>
        
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <DollarSign className="w-3 h-3 mr-1" />
          {formatNumber(userBalance, 0)} USDY Available
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

      {/* Assets Grid - NO DEBUG BANNERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-48 object-cover rounded-t-lg"
                key={`asset-img-${asset.id}-${Date.now()}`}
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
                    {formatNumber(asset.totalValue, 0)} USDY
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Price/Share</span>
                  <div className="font-semibold text-black">
                    {formatNumber(asset.pricePerShare, 0)} USDY
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center">
                        <Building className="w-6 h-6 mr-2" />
                        {asset.name}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Asset Image */}
                      <div className="space-y-4">
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Badge className={getRiskColor(asset.riskLevel)}>
                            {asset.riskLevel} Risk
                          </Badge>
                          <Badge className="bg-black text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {asset.expectedYield}% APY
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Asset Details */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Asset Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{asset.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {asset.location}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Creator:</span>
                              <span className="font-medium">{asset.creator}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Financial Details</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-600 block">Total Value</span>
                              <span className="font-bold text-lg">{formatNumber(asset.totalValue, 0)} USDY</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-600 block">Price per Share</span>
                              <span className="font-bold text-lg">{formatNumber(asset.pricePerShare, 0)} USDY</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-600 block">Total Shares</span>
                              <span className="font-bold text-lg">{formatNumber(asset.totalShares, 0)}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-600 block">Available</span>
                              <span className="font-bold text-lg">{formatNumber(asset.availableShares, 0)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Description</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">{asset.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                          <div className="flex flex-wrap gap-2">
                            {asset.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Purchase Section */}
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-semibold mb-3">Purchase Shares</h3>
                          <div className="flex gap-3 items-end">
                            <div className="flex-1">
                              <label className="text-sm text-gray-600 block mb-1">Number of Shares</label>
                              <input
                                type="number"
                                min="1"
                                max={asset.availableShares}
                                value={purchaseShares}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value)
                                  if (!isNaN(value) && value > 0) {
                                    setPurchaseShares(value)
                                  }
                                }}
                                onBlur={(e) => {
                                  if (!e.target.value || parseInt(e.target.value) < 1) {
                                    setPurchaseShares(1)
                                  }
                                }}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              Total: <span className="font-bold">{formatNumber(asset.pricePerShare * purchaseShares, 0)} USDY</span>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handlePurchase(asset, purchaseShares)}
                            disabled={isPurchasing || userBalance < (asset.pricePerShare * purchaseShares)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {isPurchasing ? 'Processing...' : `Purchase ${purchaseShares} Shares`}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePurchase(asset, 1)}
                  disabled={isPurchasing || userBalance < asset.pricePerShare}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {isPurchasing ? 'Buying...' : `Buy 1 Share (${asset.pricePerShare} USDY)`}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction Result Modal */}
      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        success={modalState.success}
        title={modalState.title}
        message={modalState.message}
        txHash={modalState.txHash}
        explorerUrl={modalState.explorerUrl}
      />
    </div>
  )
}