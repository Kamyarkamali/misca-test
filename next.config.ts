import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "misca.ir",
        pathname: "/assets/images/products/**",
      },
    ],
  },
};

export default nextConfig;
