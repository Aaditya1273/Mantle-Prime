'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Building, 
  ArrowUpRight,
  DollarSign,
  Shield,
  CheckCircle,
  PieChart
} from 'lucid


  const { address } = useAccount()
  const [portfolioData] = useState({
    totalValue: 125000,
    mETHDeposited: 50,
    creditUsed: 75000,
    rwaInvestments: 45000,
    totalAPY: 12.5,
    healthFactor: 1.6,
    mETHYield: 4.2,
    rwaYield: 8.3,
    monthlyYield: 1250
  })

  const quickStats = [
    {
     e",
      value: `$${portfolioData.totalV,
      change: "+12.5%",
      icon: DollarSign,
      description: "Combined 
    },
    {
      ", 
     ,
      change: "+2.1%",
      icon: Wallet,
      description: "Eawards"
    },
    {
      title: "Credit Utilized",
      ing()}`,
     
      icon: CreditCard,
      description: "USDY credit lines issued"
    },
    {
      title: "RWA Invesents",
      value: `$${portfolioData.rwaInvestments
      .3%",
     uilding,
      description: "Fractional dings"
    }
  ]

  return (
    <div className="space-y-8 p-6 bgn">
      */}
   ">
>
          <h1 className="t>
     ew
          </h1>
          <p className="text-text-secondary text
            Institutionaletwork
          </p>
        </div>
       
     ">
          <div classN
            <CheckCircle className="w-3 h-3" />
            KYC Verified
          </div>
          <Badge classNam-1">
      
     
          </Badge>
        </div>
      </div>

      {/* Key Metrics Gri
      
     
          <Card key=
            <CardContent className="p-6">
              <div classN
                <stat.ic
                <span cladium">
     }
   n>

          >
                <p className="m/p>
                <p className>
                <p className="text-text-secondary text-s
             
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doube */}
      <Card clal">
        >
          <CardTitle className="financial-heading texitle>
          <CardDescription className="text-text-secondary">
            Earn simultaneous returns from mETH
          </CardDescription>
        </CardHeadr>
        <CardC-8">
          <d">
     
            {/* mETH Staking Y}
            <div className="text-center">
              <div className="w-16 h-16 bgo mb-4">
                <Wallet className="w-8 h-8 text-ink-black" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink->
              <div className%</div>
              <p className
              <div className="mt-4 p-3 bg-surface-gray rounde-lg">
                <p classN
                  ${(port
                </p>
              </div>
            </div>

            {/* Plus Symbol */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-accent-teal rounded-full flex items-cent">
                <spa
              </div>
            </div>

            {/* RWA Yield */}
            <div cla">
              <div className="w-16 h-16 bg-surface-gray 
                <Building classNam/>
              </div>
              <h3 classNamh3>
              <di>
           </p>
            ">
>
                  ${(portfolioDatar
                </p>
        v>
            </div>
          </div>

          {/* Combined Result */}
          <div className="mt-8 p-6 bg-surface-gray roht">
            <div className="text-cente">
              <h4 classN
              <div className="yield-number text-5xl tex}%</div>
              <p className="text-text-secondary mb-4"
              <div className="
                <div>
                  <span className="text-text-an>
                  <span classan>
                </div>
                <div>
                  <span className="text-tex
                  <s/span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Health & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Portfoli
        <Card clasional">
>
            <CardTitle className=ding">
              <Shield className="w-5 h->
              Portfolio Health
            </CardTitle>
            <CardDescription>Monitor risk metrics and collateral status
          </CardHeader>
          <CardContent 
            <div>
              <div classb-2">
                <span className="text-text-secondary font-medium">Health Facto
                <span className>
                ctor}x
                </span>
              </div>
              <divl">
                <dv 
ll" 
                  style={{ width:}
                />
              </div>
              <p className=">
                Liquidald: 1.2x
              </p>
            </div>

            <div c">
              <div classed-lg">
               >

                  ${(portfolioD)}
                </p>
              </div>
              <div className="p-4 bg-surface-gray rounded-lg">
                <p className="text-text-secondary text-</p>
                <p className="font-ser>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-institutional">
          <CardHeader>
            <CardTitle ctle>
            <CardDescription>Manage your positionsn>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button clas">
              <Wallet className="w-4 h-4 mr-2" />
              Deposit More mETH
            </Button>
            <Button clas>
              <CreditCard className="w-4 h-4 mr-2" />
              Issue Additional Credit
            </Button>
            <Button className="btn-ou
              <Building " />
              Browse Rplace
            </Button>
            <Butto
            2" />
              View Detailed Portfolio
            </Button>
          </CardContet>
        </Card>
      </div>

*/}
      <Card className="card-institu>
        <CardHeader>
          <CardTitle className="financial-heading">Recent Activityitle>
          <CardDescription>Latest transactions and yield distributions</Carion>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Yield Claimed", amount: "$125
              { action: "Shares Purchased", amount: "50 shares", asset: "Corporate Bond Porago" },
              { action: "Credit Issued", amount: "$10,000 s ago" },
              {  }
            ].ma=> (
              <div key={index} className="flex items-center justify-between p-4 bg-surface-gray rounded-lg">
                <div c
                  < />
                  <div>
             </p>
          
   
 
  )
}   </div>rd>
 Cat>
      </onten     </CardC </div>
         
            ))}  /div>
       <
          </div>             
 </p>.time}">{activityry text-smcondat-text-se"texme= classNa<p              t}</p>
    .amounty">{activicknk-blaext-id tibolt-sem"fone=amsN<p clas              ">
    htext-rig"tlassName=      <div c
          ></div               