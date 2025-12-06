/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir: true, // Only if using App Router structure
  },
  // Ensure environment variables are accessible if using Next.js build
  env: {
    API_KEY: process.env.API_KEY,
  },
};

module.exports = nextConfig;