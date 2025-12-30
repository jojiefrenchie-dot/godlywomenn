import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Allow HTTPS images from any domain (production)
      {
        protocol: 'https',
        hostname: '**',
      },
      // Allow local development on all interfaces
      {
        protocol: 'http',
        hostname: '**',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Optimize for production
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
