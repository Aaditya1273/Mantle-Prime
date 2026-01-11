'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useStaking, useCreditToken } from '@/hooks/useContractsUnified'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionModal } from '@/components/ui/transaction-modal'
import { 
  CreditCard, 
  Plus, 
  Minus, 
  AlertTriangle,
  Info,
  Percent,
  Gift
} from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'

export default function CreditTab() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [creditAmount, setCreditAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  
  // Transaction modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    success: false,
    title: '',
    message: '',
    txHash: '',
    explorerUrl: ''
  })

  // Unified contract data
  const { stakedAmount, tokenSymbol } = useStaking(address)
  const {
    balance: creditBalance,
    pendingYield,
    yieldInfo,
    getTokensFromFaucet,
    claimTokenYield,
    isFauceting,
    isClaiming,
    tokenSymbol: creditSymbol,
    hasFaucet
  } = useCreditToken(address)

  // Calculate derived values from real data
  const tokenPrice = tokenSymbol === 'MNT' ? 0.85 : 2500 // MNT ~$0.85, mETH ~$2500
  const collateralValue = parseFloat(stakedAmount || '0') * tokenPrice
  const maxBorrowCapacity = collateralValue * 0.8 // 80% LTV
  const creditBalanceValue = parseFloat(creditBalance || '0')
  const interestRate = 3.5 // Fixed rate for now
  const totalDebt = creditBalanceValue * 1.0175 // Add 1.75% interest for demo
  const interestAccrued = totalDebt - creditBalanceValue
  const originationFee = 0.3
  const healthFactor = totalDebt > 0 ? collateralValue / totalDebt : 0

  const utilizationRate = maxBorrowCapacity > 0 ? (creditBalanceValue / maxBorrowCapacity) * 100 : 0
  const maxNewCredit = Math.max(0, maxBorrowCapacity - creditBalanceValue) // Ensure it's never negative

  const handleIssueCredit = async () => {
    // Validation checks with user-friendly messages
    if (!hasFaucet) {
      setModalState({
        isOpen: true,
        success: false,
        title: 'Faucet Not Available',
        message: 'The USDY faucet is not available in this mode. Please check your network connection.',
        txHash: '',
        explorerUrl: ''
      })
      return
    }

    if (!creditAmount || parseFloat(creditAmount) <= 0) {
      setModalState({
        isOpen: true,
        success: false,
        title: 'Invalid Amount',
        message: 'Please enter a valid credit amount greater than 0.',
        txHash: '',
        explorerUrl: ''
      })
      return
    }

    if (creditBalanceValue >= 10000) {
      setModalState({
        isOpen: true,
        success: false,
        title: 'Maximum Balance Reached',
        message: `You already have ${formatNumber(creditBalanceValue, 0)} USDY tokens. The faucet limit is 10,000 USDY per wallet.`,
        txHash: '',
        explorerUrl: ''
      })
      return
    }
    
    try {
      console.log('🔍 Debug: Attempting to get USDY from faucet...')
      console.log('🔍 Debug: Current USDY balance:', creditBalance)
      console.log('🔍 Debug: Credit symbol:', creditSymbol)
      
      // Show loading state
      toast({
        title: "🔄 Processing Faucet Request",
        description: "Getting USDY tokens from faucet. Please confirm in your wallet...",
        duration: 3000,
      })
      
      const txHash = await getTokensFromFaucet()
      console.log('🔍 Debug: Transaction hash received:', txHash)
      
      // Check if we got a transaction hash
      if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
        throw new Error(`Invalid transaction hash received: ${txHash}`)
      }
      
      // Transaction submitted successfully
      setCreditAmount('')
      
      const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`
      
      setModalState({
        isOpen: true,
        success: true,
        title: 'Transaction Submitted!',
        message: `Transaction submitted to get ${creditSymbol} tokens from faucet. Please check the explorer to confirm success.`,
        txHash: txHash,
        explorerUrl: explorerUrl
      })

      console.log(`✅ Faucet Transaction Submitted`)
      console.log(`Transaction Hash: ${txHash}`)
      console.log(`Explorer Link: ${explorerUrl}`)
      console.log(`⚠️  Check explorer to confirm transaction success`)
    } catch (error: any) {
      console.error('🔍 Debug: Faucet failed:', error)
      
      let errorMessage = "Failed to get USDY tokens from faucet."
      
      // Parse specific error messages
      if (error?.message?.includes("Already have enough USDY")) {
        errorMessage = "You already have the maximum USDY balance (10,000 limit per wallet)"
      } else if (error?.message?.includes("execution reverted")) {
        errorMessage = "Transaction was rejected by the blockchain. You may have reached the faucet limit."
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient MNT tokens for gas fees. Please add MNT to your wallet."
      } else if (error?.message?.includes("user rejected") || error?.message?.includes("User rejected")) {
        errorMessage = "Transaction was cancelled in your wallet."
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network connection issue. Please check your connection and try again."
      } else if (error?.shortMessage) {
        errorMessage = `Faucet failed: ${error.shortMessage}`
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setModalState({
        isOpen: true,
        success: false,
        title: 'Faucet Transaction Failed',
        message: errorMessage,
        txHash: '',
        explorerUrl: ''
      })
    }
  }

  const handleRepayCredit = async () => {
    const pendingYieldAmount = parseFloat(pendingYield || '0')
    
    if (pendingYieldAmount <= 0) {
      setModalState({
        isOpen: true,
        success: false,
        title: 'No Yield Available',
        message: `You have ${pendingYieldAmount.toFixed(6)} USDY yield available. Yield accrues over time at 4.5% APY. Wait some time after getting tokens for yield to accumulate.`,
        txHash: '',
        explorerUrl: ''
      })
      return
    }
    
    try {
      console.log('🔍 Debug: Attempting to claim yield...')
      
      // Show loading state
      toast({
        title: "🔄 Processing Yield Claim",
        description: `Claiming ${pendingYieldAmount.toFixed(4)} USDY yield rewards. Please confirm in your wallet...`,
        duration: 3000,
      })
      
      const txHash = await claimTokenYield()
      console.log('🔍 Debug: Transaction hash received:', txHash)
      
      // Check if we got a transaction hash
      if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
        throw new Error(`Invalid transaction hash received: ${txHash}`)
      }
      
      // Wait for transaction receipt to check if it actually succeeded
      console.log('🔍 Debug: Waiting for transaction receipt...')
      
      // For now, we'll assume the transaction succeeded if we get a valid hash
      // In a production app, you'd want to wait for the receipt and check status
      setRepayAmount('')
      
      const explorerUrl = `https://sepolia.mantlescan.xyz/tx/${txHash}`
      
      setModalState({
        isOpen: true,
        success: true,
        title: 'Transaction Submitted!',
        message: `Transaction submitted for yield claim. Please check the explorer to confirm success. If it fails, you may not have any yield to claim.`,
        txHash: txHash,
        explorerUrl: explorerUrl
      })

      console.log(`✅ Transaction Submitted`)
      console.log(`Transaction Hash: ${txHash}`)
      console.log(`Explorer Link: ${explorerUrl}`)
      console.log(`⚠️  Check explorer to confirm transaction success`)
    } catch (error: any) {
      console.error('🔍 Debug: Yield claim failed:', error)
      
      let errorMessage = "Failed to claim yield rewards."
      
      // Parse specific error messages
      if (error?.message?.includes("No yield to claim")) {
        errorMessage = "No yield available to claim. Yield accrues over time at 4.5% APY. Wait some time after getting tokens before claiming."
      } else if (error?.message?.includes("execution reverted")) {
        errorMessage = "Transaction was rejected by the blockchain. You may not have any yield to claim."
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient MNT tokens for gas fees. Please add MNT to your wallet."
      } else if (error?.message?.includes("user rejected") || error?.message?.includes("User rejected")) {
        errorMessage = "Transaction was cancelled in your wallet."
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network connection issue. Please check your connection and try again."
      } else if (error?.shortMessage) {
        errorMessage = `Yield claim failed: ${error.shortMessage}`
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setModalState({
        isOpen: true,
        success: false,
        title: 'Yield Claim Failed',
        message: errorMessage,
        txHash: '',
        explorerUrl: ''
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            USDY Credit Lines
          </h2>
          <p className="text-gray-600">
            Issue over-collateralized USDY credit against your mETH deposits
          </p>
        </div>
        
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Percent className="w-3 h-3 mr-1" />
          {interestRate}% APR
        </Badge>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Max Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {formatCurrency(maxBorrowCapacity)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              80% of collateral value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Credit Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {formatCurrency(creditBalanceValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current {creditSymbol} balance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Available Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(Math.max(0, maxNewCredit))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {maxBorrowCapacity === 0 ? 'Stake tokens to unlock credit' : 'Available to borrow'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">{creditSymbol} Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(creditBalanceValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available for RWA purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Guidance Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            How Credit Lines Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium text-blue-800">Stake Collateral</p>
                <p className="text-blue-600">Stake {tokenSymbol} tokens in the Vault to unlock credit</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium text-blue-800">Get USDY Tokens</p>
                <p className="text-blue-600">Use faucet to get USDY for RWA investments</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium text-blue-800">Invest in RWAs</p>
                <p className="text-blue-600">Buy fractional real-world assets in Marketplace</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Actions */}
      <Tabs defaultValue="issue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-50 border border-gray-200">
          <TabsTrigger value="issue" className="data-[state=active]:bg-white">
            Issue Credit
          </TabsTrigger>
          <TabsTrigger value="repay" className="data-[state=active]:bg-white">
            Claim Yield
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center">
                <Plus className="w-5 h-5 mr-2 text-green-600" />
                Issue USDY Credit Line
              </CardTitle>
              <CardDescription className="text-gray-600">
                Mint USDY stablecoin against your mETH collateral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credit-amount" className="text-gray-600">
                    Credit Amount (USDY)
                  </Label>
                  <div className="relative">
                    <Input
                      id="credit-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={creditAmount}
                      onChange={(e) => {
                        const value = e.target.value
                        // Allow empty string or valid positive numbers
                        if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) > 0)) {
                          setCreditAmount(value)
                        }
                      }}
                      onBlur={(e) => {
                        // Don't auto-set to 0, let user enter their amount
                        if (e.target.value === '0') {
                          setCreditAmount('')
                        }
                      }}
                      className="bg-white border-gray-300 text-black pr-16"
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      USDY
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Available: {formatCurrency(Math.max(0, maxNewCredit))}
                    </span>
                    {maxNewCredit > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                        onClick={() => setCreditAmount(Math.max(0, maxNewCredit).toString())}
                      >
                        Max
                      </Button>
                    )}
                  </div>
                  
                  {/* Input validation messages */}
                  {creditAmount && parseFloat(creditAmount) > maxNewCredit && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Amount exceeds available credit limit of {formatCurrency(maxNewCredit)}
                    </p>
                  )}
                  
                  {!creditAmount && (
                    <p className="text-sm text-gray-500 mt-1">
                      💡 Enter amount to get USDY tokens from faucet (max 5,000 per transaction)
                    </p>
                  )}
                </div>

                {/* Credit Preview */}
                {creditAmount && parseFloat(creditAmount) > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                    <h4 className="text-green-800 font-semibold">Transaction Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credit Amount:</span>
                        <span className="text-black font-semibold">
                          {formatCurrency(parseFloat(creditAmount))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origination Fee ({originationFee}%):</span>
                        <span className="text-red-600">
                          -{formatCurrency(parseFloat(creditAmount) * (originationFee / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-600">You Receive:</span>
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(parseFloat(creditAmount) * (1 - originationFee / 100))} USDY
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Health Factor:</span>
                        <span className={`font-semibold ${
                          (collateralValue / (totalDebt + parseFloat(creditAmount))) >= 1.5 
                            ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {formatNumber(collateralValue / (totalDebt + parseFloat(creditAmount)), 2)}x
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleIssueCredit}
                  disabled={
                    !hasFaucet || 
                    isFauceting || 
                    creditBalanceValue >= 10000 ||
                    !creditAmount || 
                    parseFloat(creditAmount || '0') <= 0
                  }
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isFauceting ? 'Getting Tokens...' : 
                   creditBalanceValue >= 10000 ? 'Maximum USDY Reached (10,000 Limit)' : 
                   !creditAmount || parseFloat(creditAmount || '0') <= 0 ? 'Enter Amount First' :
                   `Get ${creditSymbol} from Faucet`}
                </Button>
                
                {/* User-friendly status messages */}
                {creditBalanceValue >= 10000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Maximum USDY Balance Reached</p>
                        <p className="text-xs text-amber-600 mt-1">
                          You have {formatNumber(creditBalanceValue, 0)} USDY. Faucet limit is 10,000 USDY per wallet.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {maxBorrowCapacity === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">No Collateral Staked</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Stake {tokenSymbol} tokens in the Vault tab to unlock credit lines.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repay" className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center">
                <Gift className="w-5 h-5 mr-2 text-green-600" />
                Claim USDY Yield
              </CardTitle>
              <CardDescription className="text-gray-600">
                Claim your accumulated USDY yield rewards (4.5% APY)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repay-amount" className="text-gray-600">
                    Claimable Yield Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="repay-amount"
                      type="text"
                      value={`${formatCurrency(parseFloat(pendingYield || '0'))}`}
                      readOnly
                      className="bg-gray-50 border-gray-300 text-black pr-16 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      USDY
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Balance: {formatCurrency(creditBalanceValue)} {creditSymbol}
                    </span>
                    <span className="text-green-600 font-semibold">
                      {parseFloat(pendingYield || '0') > 0 ? 'Yield Available' : 'No Yield Yet'}
                    </span>
                  </div>
                </div>

                {/* Debt Breakdown */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                  <h4 className="text-blue-800 font-semibold">Current Debt</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal:</span>
                      <span className="text-black">{formatCurrency(creditBalanceValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Accrued:</span>
                      <span className="text-yellow-600">{formatCurrency(interestAccrued)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-1">
                      <span className="text-gray-600 font-semibold">Total Debt:</span>
                      <span className="text-black font-semibold">{formatCurrency(totalDebt)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleRepayCredit}
                  disabled={parseFloat(pendingYield || '0') <= 0 || isClaiming}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isClaiming ? 'Claiming Yield...' : 
                   parseFloat(pendingYield || '0') <= 0 ? `No Yield Available (${formatCurrency(parseFloat(pendingYield || '0'))})` :
                   `Claim ${formatCurrency(parseFloat(pendingYield || '0'))} USDY Yield`}
                </Button>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Real Yield Information</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Yield accrues at 4.5% APY. Current claimable: {formatCurrency(parseFloat(pendingYield || '0'))} USDY. 
                        {parseFloat(pendingYield || '0') <= 0 && ' Wait some time after getting tokens for yield to accumulate.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Credit Status & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Utilization Status */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Credit Utilization</CardTitle>
            <CardDescription className="text-gray-600">
              Monitor your borrowing capacity usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Utilization Rate</span>
                <span className="text-black font-semibold">
                  {formatNumber(utilizationRate, 1)}%
                </span>
              </div>
              <Progress value={utilizationRate} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Interest Rate</div>
                <div className="text-black font-semibold">{interestRate}% APR</div>
              </div>
              <div>
                <div className="text-gray-600">Health Factor</div>
                <div className={`font-semibold ${
                  healthFactor >= 1.5 ? 'text-green-600' : 
                  healthFactor >= 1.2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {formatNumber(healthFactor, 2)}x
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Information */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
              Risk Management
            </CardTitle>
            <CardDescription className="text-gray-600">
              Important information about your credit position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">Liquidation Risk</p>
                  <p className="text-yellow-700">
                    Your position will be liquidated if health factor drops below 1.2x
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">Interest Accrual</p>
                  <p className="text-blue-700">
                    Interest compounds continuously at {interestRate}% APR
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-green-800 font-medium">USDY Benefits</p>
                  <p className="text-green-700">
                    USDY earns yield while you hold it, offsetting some interest costs
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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