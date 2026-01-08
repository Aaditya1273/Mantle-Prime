'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, TrendingUp, Zap, Users, CheckCircle, Star } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="text-xl font-bold text-white">Mantle Prime</span>
          </motion.div>

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
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
              Next-Gen Asset Tokenization Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Earn <span className="gradient-text">Double Yield</span>
              <br />
              Without Selling ETH
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Deposit mETH as collateral, mint USDY credit lines, and purchase fractional Real-World Assets. 
              Earn mETH staking rewards + RWA yields simultaneously on Mantle Network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="btn-gradient text-white px-8 py-6 text-lg"
                onClick={() => router.push('/dashboard')}
              >
                Launch App <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                View Documentation
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>SEC Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Institutional Grade</span>
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
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Mantle Prime?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The most advanced platform for institutional-grade RWA credit markets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Fractionalization",
                description: "Split assets into tradeable shares in seconds",
                color: "text-yellow-400"
              },
              {
                icon: Shield,
                title: "Blockchain Secured",
                description: "Military-grade security on Mantle Network",
                color: "text-blue-400"
              },
              {
                icon: TrendingUp,
                title: "Double Yield",
                description: "mETH staking + RWA returns simultaneously",
                color: "text-green-400"
              },
              {
                icon: Users,
                title: "Institutional Access",
                description: "Compliant marketplace for accredited investors",
                color: "text-purple-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
                      <feature.icon className={`h-6 w-6 text-white`} />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
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
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              How Mantle Prime Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start earning double yield in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Deposit mETH",
                description: "Deposit mETH as collateral and continue earning ~4% staking rewards",
                icon: "💰"
              },
              {
                step: "02", 
                title: "Issue Credit",
                description: "Mint over-collateralized USDY credit lines against your mETH",
                icon: "🏦"
              },
              {
                step: "03",
                title: "Buy RWAs",
                description: "Purchase fractional real-world assets and earn additional yields",
                icon: "🏠"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover bg-white/5 border-white/10 backdrop-blur-sm relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <CardHeader className="text-center pt-8">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <CardTitle className="text-white">{step.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
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
              { label: "Total Value Locked", value: "$50M+", icon: "💎" },
              { label: "Active Users", value: "2,500+", icon: "👥" },
              { label: "RWA Assets", value: "150+", icon: "🏢" },
              { label: "Average APY", value: "12.5%", icon: "📈" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Earn Double Yield?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of investors earning mETH staking rewards + RWA yields on Mantle Prime
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => router.push('/dashboard')}
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/40 border-t border-white/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <span className="text-lg font-bold text-white">Mantle Prime</span>
          </div>
          <p className="text-gray-400 mb-4">
            Institutional-Grade RWA Credit Marketplace on Mantle Network
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}