# 🚀 Vercel Deployment Guide - Mantle Prime

## ⚠️ IMPORTANT: Fix Dependencies First

Before deploying, you need to fix the dependency conflicts:

### Step 1: Fix Dependencies

**On Windows:**
```bash
fix-deps.bat
```

**On Mac/Linux:**
```bash
chmod +x fix-deps.js
npm run fix-deps
```

**Or manually:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### Step 2: Test Build Locally
```bash
npm run build
```

If the build succeeds, you're ready to deploy!

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fixed dependencies - ready for deployment"
   git push origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

## 🔧 Environment Variables

**CRITICAL**: Add these environment variables in Vercel Dashboard:

### Go to: Project → Settings → Environment Variables

Add each of these **exactly as shown**:

```bash
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
NEXT_PUBLIC_MANTLE_FAUCET_URL=https://faucet.sepolia.mantle.xyz
NEXT_PUBLIC_MANTLE_NETWORK=testnet
NEXT_PUBLIC_MANTLE_STAKING_VAULT_ADDRESS=0x5F18fe5bF76466CacD97E855C471E6F017603583
NEXT_PUBLIC_MOCK_USDY_ADDRESS=0xBa8B2a116cbb0240Be18Ad7E4989CffC445Ee6d9
NEXT_PUBLIC_SIMPLIFIED_COMPLIANCE_MODULE_ADDRESS=0x9998FE942B5D873c5324295a5F1793DFCB6D5510
NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS=0x101190D8AcF4b5D4C01b60BFFc222FD3FD6E64a2
NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS=0xa31749b81470eD13C5efeAa290Cf1caB67Aeb425
NEXT_PUBLIC_PRIME_VAULT_ADDRESS=0xEa53E2fF08CD18fD31B188a72079aE9Ca34856e4
NEXT_PUBLIC_CREDIT_ISSUER_ADDRESS=0x464D37393C8D3991b493DBb57F5f3b8c31c7Fa60
NEXT_PUBLIC_RWA_MARKETPLACE_ADDRESS=0xcf4F105FeAc23F00489a7De060D34959f8796dd0
NEXT_PUBLIC_METH_ADDRESS=0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa
NEXT_PUBLIC_USDY_ADDRESS=0x5be26527e817998a7206475496fde1e68957c5a6
NEXT_PUBLIC_APP_MODE=blockchain
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=3a8170812b534d0ff9d794f19a901d64
NEXT_PUBLIC_CHAIN_ID=5003
NEXT_PUBLIC_DEMO_MODE=simplified
```

### For each variable:
1. **Name**: Copy the variable name exactly
2. **Value**: Copy the variable value exactly  
3. **Environment**: Select ALL THREE: "Production", "Preview", "Development"
4. Click "Save"

## 🔄 After Adding Variables

**MUST DO**: Redeploy after adding environment variables:

1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for completion

## ✅ Verify Deployment

After deployment, test these features:

1. **Wallet Connection**: Connect MetaMask to Mantle Sepolia
2. **Staking**: Stake MNT tokens in Vault tab
3. **Credit**: Get USDY tokens from faucet
4. **Marketplace**: Buy RWA assets
5. **Yield**: Claim yield in Credit/Portfolio tabs

## 🚨 Common Issues & Solutions

### Issue: Build fails with dependency conflicts
**Solution**: Run the fix-deps script before deploying

### Issue: "Environment Variable references Secret"
**Solution**: Don't use `@` syntax. Add variables directly in Vercel dashboard

### Issue: Wallet won't connect
**Solution**: 
- Check `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Verify you're on Mantle Sepolia testnet

### Issue: Contract interactions fail
**Solution**:
- Verify all contract addresses are correct
- Check `NEXT_PUBLIC_CHAIN_ID=5003`
- Ensure `NEXT_PUBLIC_DEMO_MODE=simplified`

## 📱 Mobile Testing

Your deployed app should work on:
- ✅ Desktop browsers
- ✅ Mobile browsers  
- ✅ MetaMask mobile app
- ✅ WalletConnect compatible wallets

## 🎉 Success!

Once deployed, your Mantle Prime DApp will be available at:
`https://your-project-name.vercel.app`

### Features that should work:
- 🏦 MNT staking with real yield
- 💰 USDY credit line with faucet
- 🏢 RWA marketplace with 8 assets
- 📊 Portfolio tracking with real data
- 💎 Yield claiming functionality
- 📱 Mobile-responsive design

Your institutional-grade RWA marketplace is now live! 🚀