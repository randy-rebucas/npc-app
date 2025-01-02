import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,

    LOGTO_WELL_KNOWN_URL: process.env.LOGTO_WELL_KNOWN_URL,
    LOGTO_CLIENT_ID: process.env.LOGTO_CLIENT_ID,
    LOGTO_CLIENT_SECRET: process.env.LOGTO_CLIENT_SECRET,

    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY,

    JWT_SECRET: process.env.JWT_SECRET,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "ms-application-assets.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "stripe.com",
      },
    ],
  },
};

export default nextConfig;
