import { toast } from '@/hooks/use-toast'

// Mantle Sepolia Explorer URL
const MANTLE_SEPOLIA_EXPLORER = 'https://sepolia.mantlescan.xyz'

export function showTransactionSuccess(
  txHash: string,
  title: string,
  description: string
) {
  // Validate transaction hash
  if (!txHash || txHash === '0x' || txHash.length !== 66) {
    console.error('Invalid transaction hash:', txHash)
    return
  }

  const explorerUrl = `${MANTLE_SEPOLIA_EXPLORER}/tx/${txHash}`
  const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
  
  // Show success toast
  toast({
    title: `✅ ${title}`,
    description: `${description}\n\nTransaction: ${shortHash}`,
    duration: 8000,
  })
  
  // Log clickable link to console
  console.log(`✅ ${title}`)
  console.log(`Transaction Hash: ${txHash}`)
  console.log(`🔗 Explorer Link: ${explorerUrl}`)
  console.log(`Click to view transaction: ${explorerUrl}`)
  
  // Show follow-up toast with instructions
  setTimeout(() => {
    toast({
      title: "🔗 View Transaction",
      description: `Hash: ${shortHash}\nCheck browser console for clickable explorer link`,
      duration: 12000,
    })
  }, 2000)
}

export function showTransactionError(
  title: string,
  description: string,
  error?: any
) {
  let errorMessage = description
  
  // Parse common error messages
  if (error?.message?.includes("Already have enough USDY")) {
    errorMessage = "You already have the maximum USDY balance (10,000 limit per wallet)"
  } else if (error?.message?.includes("execution reverted")) {
    errorMessage = "Transaction was rejected by the blockchain. Please check your balance and try again."
  } else if (error?.message?.includes("insufficient funds")) {
    errorMessage = "Insufficient MNT tokens for gas fees. Please add MNT to your wallet."
  } else if (error?.message?.includes("user rejected")) {
    errorMessage = "Transaction was cancelled in your wallet."
  } else if (error?.message?.includes("network")) {
    errorMessage = "Network connection issue. Please check your internet and try again."
  }
  
  toast({
    title: `❌ ${title}`,
    description: errorMessage,
    variant: "destructive",
    duration: 6000,
  })
}