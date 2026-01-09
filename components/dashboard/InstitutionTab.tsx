'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Plus, 
  Upload, 
  FileText, 
  DollarSign,
  Percent,
  Users,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { CONTRACTS, RWA_MARKETPLACE_ABI } from '@/lib/wagmi'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

interface AssetFormData {
  name: string
  assetType: string
  location: string
  description: string
  totalValue: string
  totalShares: string
  expectedYield: string
  features: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
  documents: File[]
}

export default function InstitutionTab() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    assetType: '',
    location: '',
    description: '',
    totalValue: '',
    totalShares: '',
    expectedYield: '',
    features: [],
    riskLevel: 'Medium',
    documents: []
  })

  const { writeContract, data: hash } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const assetTypes = [
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'private_debt', label: 'Private Debt' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'alternative', label: 'Alternative Assets' }
  ]

  const handleCreateAsset = async () => {
    if (!formData.name || !formData.totalValue || !formData.totalShares) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const totalValue = parseFloat(formData.totalValue)
    const totalShares = parseInt(formData.totalShares)
    const pricePerShare = totalValue / totalShares
    const expectedYield = parseFloat(formData.expectedYield) * 100 // Convert to basis points

    setIsCreating(true)
    try {
      // Call smart contract
      writeContract({
        address: CONTRACTS.RWAMarketplace as `0x${string}`,
        abi: RWA_MARKETPLACE_ABI,
        functionName: 'createAsset',
        args: [
          formData.name,
          formData.assetType,
          parseUnits(totalValue.toString(), 6), // USDY has 6 decimals
          BigInt(totalShares),
          parseUnits(pricePerShare.toString(), 6),
          BigInt(expectedYield)
        ],
      })

      toast({
        title: "Asset Creation Initiated",
        description: "Transaction submitted to blockchain",
      })

    } catch (error) {
      console.error('Asset creation failed:', error)
      setIsCreating(false)
      toast({
        title: "Creation Failed",
        description: "Failed to create asset. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Reset form when transaction succeeds
  if (isSuccess && isCreating) {
    setIsCreating(false)
    setFormData({
      name: '',
      assetType: '',
      location: '',
      description: '',
      totalValue: '',
      totalShares: '',
      expectedYield: '',
      features: [],
      riskLevel: 'Medium',
      documents: []
    })
    toast({
      title: "Asset Created Successfully!",
      description: "Your RWA asset is now live on the marketplace",
      variant: "success",
    })
  }

  const pricePerShare = formData.totalValue && formData.totalShares 
    ? parseFloat(formData.totalValue) / parseInt(formData.totalShares)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center">
            <Building2 className="w-8 h-8 mr-3" />
            Institution Dashboard
          </h2>
          <p className="text-gray-600">
            Create and manage tokenized real-world assets
          </p>
        </div>
        
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified Institution
        </Badge>
      </div>

      {/* Asset Creation Form */}
      <Card className="bg-white border-gray-200 ">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create New RWA Asset
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tokenize your real-world asset into fractional ERC-1155 shares
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset-name" className="text-gray-600">
                  Asset Name *
                </Label>
                <Input
                  id="asset-name"
                  placeholder="e.g., Miami Beach Luxury Apartment"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset-type" className="text-gray-600">
                  Asset Type *
                </Label>
                <Select 
                  value={formData.assetType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assetType: value }))}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-black">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-gray-300">
                    {assetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-black">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-600">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Miami Beach, FL"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="total-value" className="text-gray-600">
                  Total Asset Value (USD) *
                </Label>
                <Input
                  id="total-value"
                  type="number"
                  placeholder="500000"
                  value={formData.totalValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalValue: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total-shares" className="text-gray-600">
                  Total Shares *
                </Label>
                <Input
                  id="total-shares"
                  type="number"
                  placeholder="10000"
                  value={formData.totalShares}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalShares: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-yield" className="text-gray-600">
                  Expected Annual Yield (%) *
                </Label>
                <Input
                  id="expected-yield"
                  type="number"
                  step="0.1"
                  placeholder="8.0"
                  value={formData.expectedYield}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedYield: e.target.value }))}
                  className="bg-white border-gray-300 text-black"
                />
              </div>
            </div>
          </div>

          {/* Calculated Values */}
          {pricePerShare > 0 && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-300 font-semibold mb-2">Calculated Values</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Price per Share</div>
                  <div className="text-black font-semibold">{formatCurrency(pricePerShare)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Min Investment</div>
                  <div className="text-black font-semibold">{formatCurrency(pricePerShare)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Expected Annual Return</div>
                  <div className="text-green-600 font-semibold">
                    {formData.expectedYield ? `${formData.expectedYield}%` : '0%'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-600">
              Asset Description
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the asset, its features, and investment thesis..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white border-gray-300 text-black min-h-[100px]"
            />
          </div>

          <Separator className="bg-white/10" />

          {/* Documentation Upload */}
          <div className="space-y-4">
            <h4 className="text-black font-semibold flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Required Documentation
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-300 rounded-lg border-dashed">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Asset Valuation Report</p>
                  <p className="text-gray-500 text-xs">PDF, max 10MB</p>
                </div>
              </div>
              
              <div className="p-4 border border-gray-300 rounded-lg border-dashed">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Legal Documentation</p>
                  <p className="text-gray-500 text-xs">PDF, max 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Compliance Notice */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 font-medium text-sm">Compliance Requirements</p>
                <p className="text-yellow-300/80 text-sm mt-1">
                  By creating this asset, you confirm that all regulatory requirements have been met, 
                  including securities registration, KYC/AML compliance, and investor accreditation verification.
                </p>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <Button 
            onClick={handleCreateAsset}
            disabled={!formData.name || !formData.totalValue || !formData.totalShares || isCreating || isConfirming}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
            size="lg"
          >
            {isCreating || isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isConfirming ? 'Confirming Transaction...' : 'Creating Asset...'}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create RWA Asset
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Information Panel */}
      <Card className="bg-white border-gray-200 ">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Info className="w-5 h-5 mr-2" />
            How Asset Creation Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-black font-semibold mb-2">1. Asset Tokenization</h4>
              <p className="text-gray-600 text-sm">
                Your real-world asset is converted into ERC-1155 fractional tokens on Mantle Network
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-black font-semibold mb-2">2. Fractional Ownership</h4>
              <p className="text-gray-600 text-sm">
                Investors can buy affordable fractions starting from just one share
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-black font-semibold mb-2">3. Yield Distribution</h4>
              <p className="text-gray-600 text-sm">
                Automatically distribute rental income or asset yields to all shareholders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}