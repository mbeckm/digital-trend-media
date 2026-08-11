import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/comic",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comic/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
