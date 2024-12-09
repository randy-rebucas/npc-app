import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }
} 

declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      accessToken?: string;
  }
}
