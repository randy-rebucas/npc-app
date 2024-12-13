import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "logto",
      name: "Logto",
      type: "oauth",
      // You can get the well-known URL from the Logto Application Details page,
      // in the field "OpenID Provider configuration endpoint"
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
        // You can customize the user profile mapping here
        return {
          id: profile.sub,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  pages: {
    signIn: "/auth/signin",
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
