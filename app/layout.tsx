import type { Metadata } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Mantle Prime - Institutional RWA Credit Marketplace',
  description: 'Yield-Bearing Collateral for Compliant, Liquid Real-World Assets on Mantle Network',
  keywords: ['RWA', 'DeFi', 'Mantle', 'Credit', 'mETH', 'USDY', 'Real World Assets'],
  authors: [{ name: 'Mantle Prime Team' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Mantle Prime - RWA Credit Marketplace',
    description: 'Earn double yield: mETH staking + RWA returns without selling your ETH',
    url: 'https://mantleprime.xyz',
    siteName: 'Mantle Prime',
    images: [
      {
        url: '/logo.png',
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
    images: ['/logo.png'],
  },
  themeColor: '#0f172a',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-poppins bg-white text-black antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}