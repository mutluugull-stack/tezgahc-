import { AccountType } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      accountType: AccountType;
      isAdmin: boolean;
      approved: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    username: string;
    accountType: AccountType;
    isAdmin: boolean;
    approved: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    accountType: AccountType;
    isAdmin: boolean;
    approved: boolean;
  }
}
