import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['antsroute.com'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",  
        pathname: "/uploads/**", 
      },
    ]
  },
};

export default nextConfig;
