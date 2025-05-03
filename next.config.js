/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'api.qrserver.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bvuxlenkwhohfvismdzn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://quest-app-iota.vercel.app/' // 本番環境URL
      : 'http://localhost:3000' // 開発環境URL
  },
};

module.exports = nextConfig;