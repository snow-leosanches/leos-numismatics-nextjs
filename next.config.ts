import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'en.numista.com',
        port: '',
        pathname: '/catalogue/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
