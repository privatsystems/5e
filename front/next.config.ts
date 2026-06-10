import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
