import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'antsroute.com',
      'localhost',
      '192.168.1.54',
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.54",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.54",
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

