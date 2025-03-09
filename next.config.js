/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'api.qrserver.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bvuxlenkwhohfvismdzn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;