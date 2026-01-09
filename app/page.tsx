'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, TrendingUp, Zap, Users, CheckCircle, Star, Wallet, Building2, CreditCard, DollarSign, Users2, BarChart3, TrendingUp as TrendingUpIcon } from 'lucide-react'
import { LogoWithText } from '@/components/ui/logo'

export default function LandingPage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isConnected && mounted) {
      router.push('/dashboard')
    }
  }, [isConnected, mounted, router])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <LogoWithText 
            size="md" 
            showSubtext={false}
            className="animate-fade-in-up"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ConnectButton />
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
              Next-Gen Asset Tokenization Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight font-heading">
              Earn <span className="gradient-text">Double Yield</span>
              <br />
              Without Selling ETH
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-body">
              Deposit mETH as collateral, mint USDY credit lines, and purchase fractional Real-World Assets.
              Earn mETH staking rewards + RWA yields simultaneously on Mantle Network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => router.push('/dashboard')}
              >
                Launch App <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-6 text-lg font-semibold"
              >
                View Documentation
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">SEC Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 font-medium">Institutional Grade</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-heading">
              Why Choose Mantle Prime?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              The most advanced platform for institutional-grade RWA credit markets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Fractionalization",
                description: "Split assets into tradeable shares in seconds",
                color: "text-yellow-600"
              },
              {
                icon: Shield,
                title: "Blockchain Secured",
                description: "Military-grade security on Mantle Network",
                color: "text-blue-600"
              },
              {
                icon: TrendingUp,
                title: "Double Yield",
                description: "mETH staking + RWA returns simultaneously",
                color: "text-green-600"
              },
              {
                icon: Users,
                title: "Institutional Access",
                description: "Compliant marketplace for accredited investors",
                color: "text-purple-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <CardTitle className="text-slate-900 font-heading">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center font-body">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-heading">
              How Mantle Prime Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              Start earning double yield in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Deposit mETH",
                description: "Deposit mETH as collateral and continue earning ~4% staking rewards",
                icon: Wallet
              },
              {
                step: "02",
                title: "Issue Credit",
                description: "Mint over-collateralized USDY credit lines against your mETH",
                icon: CreditCard
              },
              {
                step: "03",
                title: "Buy RWAs",
                description: "Purchase fractional real-world assets and earn additional yields",
                icon: Building2
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>

                  <CardHeader className="text-center pt-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <CardTitle className="text-slate-900 font-heading">{step.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-gray-600 text-center font-body">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Total Value Locked", value: "$50M+", icon: DollarSign },
              { label: "Active Users", value: "2,500+", icon: Users2 },
              { label: "RWA Assets", value: "150+", icon: Building2 },
              { label: "Average APY", value: "12.5%", icon: BarChart3 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-slate-700" />
                </div>
                <div className="text-3xl font-bold text-slate-900 font-heading mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium font-body">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-heading">
              Ready to Earn Double Yield?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-body">
              Join thousands of investors earning mETH staking rewards + RWA yields on Mantle Prime
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => router.push('/dashboard')}
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg font-semibold"
              >
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <LogoWithText size="sm" showSubtext={false} />
          </div>
          <p className="text-gray-600 mb-6 font-body">
            Institutional-Grade RWA Credit Marketplace on Mantle Network
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500 font-body">
            <a href="#" className="hover:text-slate-900 transition-colors font-medium">Documentation</a>
            <a href="#" className="hover:text-slate-900 transition-colors font-medium">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors font-medium">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors font-medium">Support</a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-body">
              © 2026 Mantle Prime. Built on Mantle Network.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}