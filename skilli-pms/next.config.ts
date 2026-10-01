import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pms",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
