import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.ctfassets.net"], // Allow images from Contentful's domain
  },
};

export default nextConfig;
