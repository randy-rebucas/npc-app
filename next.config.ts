import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    SHARETRIBE_CLIENT_ID: process.env.SHARETRIBE_CLIENT_ID,
    SHARETRIBE_CLIENT_SECRET: process.env.SHARETRIBE_CLIENT_SECRET,
    LOGTO_WELL_KNOWN_URL: process.env.LOGTO_WELL_KNOWN_URL,
    LOGTO_CLIENT_ID: process.env.LOGTO_CLIENT_ID,
    LOGTO_CLIENT_SECRET: process.env.LOGTO_CLIENT_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
};

export default nextConfig;
