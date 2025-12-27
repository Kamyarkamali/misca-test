import type { NextConfig } from "next";

// دامنه برای گرفتن عکس های خارجی-

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "misca.ir",
        pathname: "/assets/images/products/**",
      },
      {
        protocol: "https",
        hostname: "misca.ir",
        pathname: "/assets/images/business/**",
      },
      {
        protocol: "https",
        hostname: "api.misca.ir",
        pathname: "/temp/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.misca.ir",
        pathname: "/product-images/**",
      },
    ],
  },
};

export default nextConfig;
