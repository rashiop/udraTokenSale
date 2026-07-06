import type { Metadata } from 'next';

import { Providers } from './provider';

import { inter, openSans } from '@/ui/font';
import { Header, Footer } from '@/ui/organisms';

import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

const APP_NAME = "Udra's Store";
const APP_DESCRIPTION = 'Buy and sell Udra tokens with ETH on Sepolia testnet. A decentralized token sale platform.';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['token sale', 'ethereum', 'web3', 'defi', 'sepolia', 'udra token', 'crypto'],
  authors: [{ name: 'Rashiop' }],
  creator: 'Rashiop',
  // Fake url for metadata generation
  metadataBase: new URL('https://udra-token.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: '/',
    siteName: APP_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${openSans.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="dark flex min-h-screen flex-col bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
            <div className="pointer-events-none fixed inset-0 bg-linear-to-tr from-purple-500/10 via-transparent to-cyan-500/10" />
            <Header />
            <main className="relative z-10 flex flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
