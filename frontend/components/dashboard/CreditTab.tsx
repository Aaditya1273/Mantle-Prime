'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { CONTRACTS, TOKENS, CREDIT_ISSUER_ABI, ERC20_ABI } from '@/lib/wagmi'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Plus, 
  Minus, 
  TrendingUp,
  AlertTriangle,
  Info,
  DollarSign,
  Percent
} from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'

export default function CreditTab() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [creditAmount, setCreditAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  const [isIssuing, setIsIssuing] = useState(false)
  const [isRepaying, setIsRepaying] = useState(false)

  // Mock data - replace with real contract reads
  const [creditData, setCreditData] = useState({
    collateralValue: 125000,
    maxBorrowCapacity: 100000, // 80% of collateral
    creditIssued: 75000,
    availableCredit: 25000,
    interestRate: 3.5,
    healthFactor: 1.67,
    totalDebt: 76312.50, // Principal + interest
    interestAccrued: 1312.50,
    usdyBalance: 5000,
    originationFee: 0.3
  })

  const handleIssueCredit = async () => {
    if (!creditAmount || parseFloat(creditAmount) <= 0) return
    
    setIsIssuing(true)
    try {
      console.log('Issuing credit line...')
      
      // Mock transaction
      setTimeout(() => {
        const amount = parseFloat(creditAmount)
        const fee = amount * (creditData.originationFee / 100)
        const netAmount = amount - fee
        
        setCreditData(prev => ({
          ...prev,
          creditIssued: prev.creditIssued + amount,
          availableCredit: prev.availableCredit - amount,
          totalDebt: prev.totalDebt + amount,
          usdyBalance: prev.usdyBalance + netAmount
        }))
        setCreditAmount('')
        setIsIssuing(false)
        toast({
          title: "Credit Issued Successfully",
          description: `Issued ${formatCurrency(amount)} USDY credit line`,
          variant: "success",
        })
      }, 2000)

    } catch (error) {
      console.error('Credit issuance failed:', error)
      setIsIssuing(false)
      toast({
        title: "Credit Issuance Failed",
        description: "Failed to issue credit line. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRepayCredit = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) return
    
    setIsRepaying(true)
    try {
      console.log('Repaying credit...')
      
      // Mock transaction
      setTimeout(() => {
        const amount = parseFloat(repayAmount)
        
        setCreditData(prev => ({
          ...prev,
          creditIssued: Math.max(0, prev.creditIssued - amount),
          availableCredit: prev.availableCredit + amount,
          totalDebt: Math.max(0, prev.totalDebt - amount),
          usdyBalance: Math.max(0, prev.usdyBalance - amount)
        }))
        setRepayAmount('')
        setIsRepaying(false)
        toast({
          title: "Credit Repaid Successfully",
          description: `Repaid ${formatCurrency(amount)} USDY`,
          variant: "success",
        })
      }, 2000)

    } catch (error) {
      console.error('Credit repayment failed:', error)
      setIsRepaying(false)
      toast({
        title: "Repayment Failed",
        description: "Failed to repay credit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const utilizationRate = (creditData.creditIssued / creditData.maxBorrowCapacity) * 100
  const maxNewCredit = Math.min(creditData.availableCredit, creditData.maxBorrowCapacity - creditData.creditIssued)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            USDY Credit Lines
          </h2>
          <p className="text-gray-300">
            Issue over-collateralized USDY credit against your mETH deposits
          </p>
        </div>
        
        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
          <Percent className="w-3 h-3 mr-1" />
          {creditData.interestRate}% APR
        </Badge>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Max Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(creditData.maxBorrowCapacity)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              80% of collateral value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Credit Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(creditData.creditIssued)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Principal amount borrowed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">Available Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(creditData.availableCredit)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Ready to borrow
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-300">USDY Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {formatCurrency(creditData.usdyBalance)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Available for RWA purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Actions */}
      <Tabs defaultValue="issue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/10">
          <TabsTrigger value="issue" className="data-[state=active]:bg-white/10">
            Issue Credit
          </TabsTrigger>
          <TabsTrigger value="repay" className="data-[state=active]:bg-white/10">
            Repay Credit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="w-5 h-5 mr-2 text-green-400" />
                Issue USDY Credit Line
              </CardTitle>
              <CardDescription className="text-gray-300">
                Mint USDY stablecoin against your mETH collateral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credit-amount" className="text-gray-300">
                    Credit Amount (USDY)
                  </Label>
                  <div className="relative">
                    <Input
                      id="credit-amount"
                      type="number"
                      placeholder="0.00"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-white pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      USDY
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Available: {formatCurrency(maxNewCredit)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      onClick={() => setCreditAmount(maxNewCredit.toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {/* Credit Preview */}
                {creditAmount && parseFloat(creditAmount) > 0 && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg space-y-3">
                    <h4 className="text-green-300 font-semibold">Transaction Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Credit Amount:</span>
                        <span className="text-white font-semibold">
                          {formatCurrency(parseFloat(creditAmount))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Origination Fee ({creditData.originationFee}%):</span>
                        <span className="text-red-300">
                          -{formatCurrency(parseFloat(creditAmount) * (creditData.originationFee / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2">
                        <span className="text-gray-300">You Receive:</span>
                        <span className="text-green-400 font-semibold">
                          {formatCurrency(parseFloat(creditAmount) * (1 - creditData.originationFee / 100))} USDY
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">New Health Factor:</span>
                        <span className={`font-semibold ${
                          (creditData.collateralValue / (creditData.totalDebt + parseFloat(creditAmount))) >= 1.5 
                            ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {formatNumber(creditData.collateralValue / (creditData.totalDebt + parseFloat(creditAmount)), 2)}x
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleIssueCredit}
                  disabled={!creditAmount || parseFloat(creditAmount) <= 0 || parseFloat(creditAmount) > maxNewCredit || isIssuing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isIssuing ? 'Issuing Credit...' : 'Issue USDY Credit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repay" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Minus className="w-5 h-5 mr-2 text-red-400" />
                Repay Credit Line
              </CardTitle>
              <CardDescription className="text-gray-300">
                Repay your USDY debt to free up collateral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repay-amount" className="text-gray-300">
                    Repayment Amount (USDY)
                  </Label>
                  <div className="relative">
                    <Input
                      id="repay-amount"
                      type="number"
                      placeholder="0.00"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-white pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      USDY
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Balance: {formatCurrency(creditData.usdyBalance)} USDY
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      onClick={() => setRepayAmount(Math.min(creditData.usdyBalance, creditData.totalDebt).toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {/* Debt Breakdown */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2">
                  <h4 className="text-blue-300 font-semibold">Current Debt</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Principal:</span>
                      <span className="text-white">{formatCurrency(creditData.creditIssued)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Interest Accrued:</span>
                      <span className="text-yellow-400">{formatCurrency(creditData.interestAccrued)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-1">
                      <span className="text-gray-300 font-semibold">Total Debt:</span>
                      <span className="text-white font-semibold">{formatCurrency(creditData.totalDebt)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleRepayCredit}
                  disabled={!repayAmount || parseFloat(repayAmount) <= 0 || parseFloat(repayAmount) > creditData.usdyBalance || isRepaying}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isRepaying ? 'Repaying...' : 'Repay Credit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Credit Status & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Utilization Status */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Credit Utilization</CardTitle>
            <CardDescription className="text-gray-300">
              Monitor your borrowing capacity usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Utilization Rate</span>
                <span className="text-white font-semibold">
                  {formatNumber(utilizationRate, 1)}%
                </span>
              </div>
              <Progress value={utilizationRate} className="h-3" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-300">Interest Rate</div>
                <div className="text-white font-semibold">{creditData.interestRate}% APR</div>
              </div>
              <div>
                <div className="text-gray-300">Health Factor</div>
                <div className={`font-semibold ${
                  creditData.healthFactor >= 1.5 ? 'text-green-400' : 
                  creditData.healthFactor >= 1.2 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {creditData.healthFactor}x
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Information */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Risk Management
            </CardTitle>
            <CardDescription className="text-gray-300">
              Important information about your credit position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-200 font-medium">Liquidation Risk</p>
                  <p className="text-yellow-300/80">
                    Your position will be liquidated if health factor drops below 1.2x
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-200 font-medium">Interest Accrual</p>
                  <p className="text-blue-300/80">
                    Interest compounds continuously at {creditData.interestRate}% APR
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Info className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-green-200 font-medium">USDY Benefits</p>
                  <p className="text-green-300/80">
                    USDY earns yield while you hold it, offsetting some interest costs
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}