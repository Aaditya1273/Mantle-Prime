import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, ExternalLink, Copy } from 'lucide-react'
import { useState } from 'react'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  success: boolean
  title: string
  message: string
  txHash?: string
  explorerUrl?: string
}

export function TransactionModal({
  isOpen,
  onClose,
  success,
  title,
  message,
  txHash,
  explorerUrl
}: TransactionModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shortHash = txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}` : ''

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {success ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-700">{message}</p>
          
          {txHash && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Transaction Hash:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(txHash)}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="font-mono text-sm bg-white p-2 rounded border break-all">
                {shortHash}
              </div>
              
              {explorerUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(explorerUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Block Explorer
                </Button>
              )}
            </div>
          )}
          
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}