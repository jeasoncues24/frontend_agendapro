import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'antsroute.com',
      'localhost',
      '192.168.1.57',
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.57",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.57",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "antsroute.com",
        pathname: "/wp-content/uploads/**",
      },
    ]
  },
};

export default nextConfig;

