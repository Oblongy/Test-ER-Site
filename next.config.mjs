/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the 'export' output mode to build a standard Next.js app with server features
  distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
