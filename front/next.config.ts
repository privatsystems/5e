import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  reactStrictMode: true,

  images: {
    domains: ["back.5eproductions.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "back.5eproductions.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/index",
        destination: "/index-page",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
};

export default nextConfig;
