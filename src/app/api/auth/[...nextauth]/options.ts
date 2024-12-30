import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider, {
  LinkedInProfile,
} from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import connect from "@/lib/db";
import User from "@/app/models/User";
import { createEvent } from "@/app/actions/events";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          await connect();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            return null;
          }
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      issuer: "https://www.linkedin.com",
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      async profile(profile: LinkedInProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    {
      id: "logto",
      name: "Logto",
      type: "oauth",
      wellKnown: process.env.LOGTO_WELL_KNOWN_URL,
      authorization: {
        params: { scope: "openid offline_access profile email" },
      },
      clientId: process.env.LOGTO_CLIENT_ID,
      clientSecret: process.env.LOGTO_CLIENT_SECRET,
      client: {
        id_token_signed_response_alg: "ES384",
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER",
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    newUser: "/onboarding",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "logto" || account?.provider === "linkedin" || account?.provider === "google") {
        try {
          await connect();
          const existingUser = await User.findOne({ email: user.email });
          const hashedPassword = await bcrypt.hash("password", 10);

          if (!existingUser) {
            const newUser = await User.create({
              email: user.email,
              username: user.email?.split("@")[0],
              password: hashedPassword,
              role: "CUSTOMER",
              // For social login, we don't store password
              provider: account.provider,
            });
            user.id = newUser._id.toString();
            user.role = "CUSTOMER";
          } else {
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
          }
        } catch (error) {
          console.error("Error during social sign in:", error);
          return false;
        }
      }
      // Log the sign-in event
      await createEvent({
        user: user.id,
        email: user.email!,
        type: "logged-in",
      });
      return true;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
};
