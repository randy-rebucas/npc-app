import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "CUSTOMER" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CUSTOMER" | "ADMIN";
  }
}
