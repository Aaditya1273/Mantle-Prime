import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mantleSepoliaTestnet, mantle } from 'wagmi/chains';

// Mantle Sepolia Testnet configuration
const mantleSepolia = {
  ...mantleSepoliaTestnet,
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Sepolia Explorer',
      url: 'https://sepolia.mantlescan.xyz',
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Mantle Prime',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [mantleSepolia, mantle],
  ssr: true,
});

export const SUPPORTED_CHAINS = [mantleSepolia, mantle];
export const DEFAULT_CHAIN = mantleSepolia;