import type { NextAuthOptions } from "next-auth";
import LinkedInProvider, {
  LinkedInProfile,
} from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/lib/db";
import User, { UserOnBoardingStatus } from "@/app/models/User";
import { createEvent } from "@/app/actions/events";
import { EventType } from "@/app/models/Event";

export const authOptions: NextAuthOptions = {
  providers: [
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
          username: profile.email?.split("@")[0],
          image: profile.picture,
          role: undefined,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          username: profile.email?.split("@")[0],
          image: profile.picture,
          role: undefined,
        };
      }
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
          username: profile.email?.split("@")[0],
          image: profile.picture,
          role: undefined,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email?.split("@")[0],
            role: undefined,
            provider: account?.provider,
            onBoardingStatus: UserOnBoardingStatus.INCOMPLETE,
          });
          
          user.id = newUser._id.toString();
          user.role = undefined;
          user.username = newUser.username;
        } else {
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.username = existingUser.username;
        }
      } catch (error) {
        console.error("Error during social sign in:", error);
        return false;
      }

      // Log the sign-in event
      await createEvent({
        user: user.id,
        email: user.email!,
        type: EventType.LOGGED_IN, 
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
