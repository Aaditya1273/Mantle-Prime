import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mantle Prime - Institutional RWA Credit Marketplace",
  description: "Yield-bearing collateral for compliant, liquid real-world assets. Deposit mETH, issue credit, invest in RWAs, earn double yield.",
  keywords: ["RWA", "Real World Assets", "Mantle", "DeFi", "Credit", "mETH", "USDY", "Yield"],
  authors: [{ name: "Mantle Prime Team" }],
  openGraph: {
    title: "Mantle Prime - Institutional RWA Credit Marketplace",
    description: "Yield-bearing collateral for compliant, liquid real-world assets",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mantle Prime",
    description: "Institutional RWA Credit Marketplace on Mantle Network",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true} style={{ fontFamily: "Inter, sans-serif" }}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}