import type { NextAuthOptions } from "next-auth";
import LinkedInProvider, {
  LinkedInProfile,
} from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/lib/db";
import User, { UserOnBoardingStatus } from "@/app/models/User";
import { createEvent } from "@/app/actions/events";
import { EventType } from "@/app/models/Event";
import { EmailService } from "@/lib/email";
import Template from "@/app/models/Template";
import { sdk } from "@/config/sharetribe";

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
      },
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
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour - how frequently to update the session
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connect();

        // Request Sharetribe token using email
        const sharetribeResponse = await sdk.login({
          username: user.email,
          password: process.env.SHARETRIBE_DEFAULT_PASSWORD,
        });

        const existingUser = await User.findOne({ email: user.email }).populate("role");

        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email?.split("@")[0],
            role: 'nurse',
            provider: account?.provider,
            onBoardingStatus: UserOnBoardingStatus.INCOMPLETE,
            sharetribeToken: sharetribeResponse.data.attributes.token ?? "", // Store Sharetribe token
            sharetribeUserId: sharetribeResponse.data.id ?? "",
          });
          const userResponse = await newUser.populate("role");
          user.id = userResponse._id.toString();
          user.role = userResponse.role.name;
          user.name = userResponse.username;
          user.email = userResponse.email;

          // Get the default template for welcome email
          let template = await Template.findOne({
            isDefault: true,
            type: "email",
            code: "welcome-email",
          });
          if (!template) {
            template = await Template.findOne({
              type: "email",
              code: "welcome-email",
            });
          }

          // Send email to NP
          const emailService = new EmailService();
          await emailService.sendEmail({
            to: { email: user.email! },
            subject: template?.name || "Welcome to NP Collaborator",
            htmlContent:
              template?.content || "<p>Welcome to NP Collaborator</p>",
            sender: {
              name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
              email:
                process.env.NEXT_PUBLIC_APP_EMAIL ||
                "noreply@npcollaborator.com",
            },
            replyTo: {
              name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
              email:
                process.env.NEXT_PUBLIC_APP_EMAIL ||
                "noreply@npcollaborator.com",
            },
          });
        } else {
          console.log(existingUser);
          // Update existing user with new Sharetribe token
          await User.findByIdAndUpdate(existingUser._id, {
            sharetribeToken: sharetribeResponse.data.attributes.token,
            sharetribeUserId: sharetribeResponse.data.id,
          });

          user.id = existingUser._id.toString();
          user.role = existingUser.role.name;
          user.name = existingUser.username;
          user.email = existingUser.email;
        }

        // Log the sign-in event
        await createEvent({
          user: user.id,
          email: user.email!,
          type: EventType.LOGGED_IN,
        });
        return true;
      } catch (error) {
        console.error("Error during social sign in:", error);
        // If Sharetribe authentication fails, you might want to:
        // 1. Either prevent the sign-in
        // 2. Or continue without Sharetribe integration
        // Depending on your requirements
        return true; // or return false if you want to prevent sign-in on Sharetribe failure
      }
    },

    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      // Handle session update
      if (trigger === "update" && session) {
        // Update the token with new session data
        return { ...token, ...session.user };
      }

      return token;
    },

    session: ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },
};
