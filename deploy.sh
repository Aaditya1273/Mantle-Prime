#!/bin/bash

# Mantle Prime - Vercel Deployment Script

echo "🚀 Deploying Mantle Prime to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project first
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo ""
    echo "📝 Don't forget to set environment variables in Vercel Dashboard:"
    echo "   - NEXT_PUBLIC_MANTLE_RPC_URL"
    echo "   - NEXT_PUBLIC_MANTLE_STAKING_VAULT_ADDRESS"
    echo "   - NEXT_PUBLIC_MOCK_USDY_ADDRESS"
    echo "   - NEXT_PUBLIC_SIMPLIFIED_RWA_MARKETPLACE_ADDRESS"
    echo "   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
    echo "   - NEXT_PUBLIC_DEMO_MODE=simplified"
    echo ""
    echo "🔗 Visit your Vercel dashboard to configure environment variables"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi