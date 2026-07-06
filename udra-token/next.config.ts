import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true, // gzip compression

  // Optimize packages (tree-shake large dependencies)
  experimental: {
    optimizePackageImports: ['lucide-react', 'viem', '@rainbow-me/rainbowkit'],
  },

  // Security headers
  // Prevents clickjacking, MIME sniffing
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

export default nextConfig;
