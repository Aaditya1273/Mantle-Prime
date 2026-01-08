import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mantle Prime - Institutional RWA Credit Marketplace',
  description: 'Yield-Bearing Collateral for Compliant, Liquid Real-World Assets on Mantle Network',
  keywords: ['RWA', 'DeFi', 'Mantle', 'Credit', 'mETH', 'USDY', 'Real World Assets'],
  authors: [{ name: 'Mantle Prime Team' }],
  openGraph: {
    title: 'Mantle Prime - RWA Credit Marketplace',
    description: 'Earn double yield: mETH staking + RWA returns without selling your ETH',
    url: 'https://mantleprime.xyz',
    siteName: 'Mantle Prime',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mantle Prime - RWA Credit Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mantle Prime - RWA Credit Marketplace',
    description: 'Earn double yield: mETH staking + RWA returns',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}