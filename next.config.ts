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

    CALENDLY_API_KEY: process.env.CALENDLY_API_KEY,
    CALENDLY_OWNER_URL: process.env.CALENDLY_OWNER_URL,
    CALENDLY_EVENT_TYPE_URL: process.env.CALENDLY_EVENT_TYPE_URL,
    CALENDLY_USER_ID: process.env.CALENDLY_USER_ID,
    CALENDLY_EVENT_TYPE_ID: process.env.CALENDLY_EVENT_TYPE_ID,

    BASE_RATE: process.env.BASE_RATE,
    CONTROLLED_SUBSTANCES_FEE: process.env.CONTROLLED_SUBSTANCES_FEE,
    ADDITIONAL_STATE_FEE: process.env.ADDITIONAL_STATE_FEE,
    ADDITIONAL_NP_FEE: process.env.ADDITIONAL_NP_FEE,
    PLATFORM_FEE: process.env.PLATFORM_FEE,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
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
      {
        protocol: "https",
        hostname: "sharetribe.imgix.net",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
};

export default nextConfig;
