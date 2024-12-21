import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connect from "@/lib/db";
import User from "@/app/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
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
          console.error('Auth error:', error);
          return null;
        }
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
          image: profile.picture,
          role: profile.role,
        };
      },
    },
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: '/onboarding'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
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