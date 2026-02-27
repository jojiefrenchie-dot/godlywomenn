import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ["localhost", "cdn.example.com"],
    unoptimized: process.env.NODE_ENV === "development",
  },
  env: {
    NEXT_PUBLIC_BACKEND_API: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000",
  },
};

export default nextConfig;
