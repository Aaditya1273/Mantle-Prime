# Mantle Prime - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd Mantle-Prime
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? **mantle-prime**
   - In which directory is your code located? **./** (current directory)

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

## 🔧 Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

### Required Environment Variables

```bash
# Mantle Network
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
NEXT_PUBLIC_MANTLE_FAUCET_URL=https://faucet.sepolia.mantle.xyz
NEXT_PUBLIC_MANTLE_NETWORK=testnet

# Contract Addresses (Simplified Mode)
NEXT_PUBLIC_MANTLE_STAKING_VAULT_ADDRESS=0x5F18fe5bF76466CacD97E855C471E6F017603583
NEXT_PUBLIC_MOCK_USDY_ADDRESS=0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9
NEXT_PUBLIC_SIMPLIFIED_COMPLIANCE_MODULE_ADDRESS=0x9998FE942B5D873c5324295a5F1793DFCB6D5510
NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS=0x101190D8AcF4b5D4C01b60BFFc222FD3FD6E64a2

# Original Contract Addresses
NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS=0xa31749b81470eD13C5efeAa290Cf1caB67Aeb425
NEXT_PUBLIC_PRIME_VAULT_ADDRESS=0xEa53E2fF08CD18fD31B188a72079aE9Ca34856e4
NEXT_PUBLIC_CREDIT_ISSUER_ADDRESS=0x464D37393C8D3991b493DBb57F5f3b8c31c7Fa60
NEXT_PUBLIC_RWA_MARKETPLACE_ADDRESS=0xcf4F105FeAc23F00489a7De060D34959f8796dd0

# Token Addresses
NEXT_PUBLIC_METH_ADDRESS=0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa
NEXT_PUBLIC_USDY_ADDRESS=0x5be26527e817998a7206475496fde1e68957c5a6

# App Configuration
NEXT_PUBLIC_APP_MODE=blockchain
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=3a8170812b534d0ff9d794f19a901d64
NEXT_PUBLIC_CHAIN_ID=5003
NEXT_PUBLIC_DEMO_MODE=simplified
```

## 📝 Adding Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable one by one:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_MANTLE_RPC_URL`)
   - **Value**: Variable value (e.g., `https://rpc.sepolia.mantle.xyz`)
   - **Environment**: Select "Production", "Preview", and "Development"

## 🔄 Redeploy After Adding Variables

After adding all environment variables:
1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"

## 🌐 Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## 🔍 Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Next.js version compatibility

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify contract addresses are correct
- Test wallet connection on deployed site

### Performance
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals
- Use Vercel's built-in performance insights

## 📊 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Wallet connection works
- [ ] Contract interactions functional
- [ ] RWA marketplace loads correctly
- [ ] Yield claiming works
- [ ] Mobile responsive design
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled

## 🚀 Production Optimizations

1. **Enable Vercel Analytics**
2. **Set up monitoring alerts**
3. **Configure custom error pages**
4. **Enable compression and caching**
5. **Set up preview deployments for testing**

Your Mantle Prime DApp is now ready for production on Vercel! 🎉