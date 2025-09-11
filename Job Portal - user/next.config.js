/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "cdn.builder.io"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: ["@/components/ui"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Custom port configuration
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
