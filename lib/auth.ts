import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: "/giris",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Kullanıcı Adı / Şifre",
      credentials: {
        username: { label: "Kullanıcı adı", type: "text" },
        password: { label: "Şifre", type: "password" },
        accountType: { label: "Hesap türü", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Kullanıcı adı ve şifre gerekli.");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username.trim().toLowerCase() },
        });

        if (!user) {
          throw new Error("Kullanıcı adı veya şifre hatalı.");
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          throw new Error("Kullanıcı adı veya şifre hatalı.");
        }

        if (
          credentials.accountType &&
          credentials.accountType !== user.accountType &&
          !user.isAdmin
        ) {
          const dogruSekme = user.accountType === "BAYI" ? "Bayi Girişi" : "Kullanıcı Girişi";
          throw new Error(`Bu hesap "${dogruSekme}" sekmesinden giriş yapmalı.`);
        }

        if (user.accountType === "BAYI" && !user.approved) {
          throw new Error("Bayi hesabınız henüz onaylanmadı. Onay sonrası giriş yapabilirsiniz.");
        }

        return {
          id: user.id,
          name: user.fullName || user.companyName || user.username,
          email: user.email,
          username: user.username,
          accountType: user.accountType,
          isAdmin: user.isAdmin,
          approved: user.approved,
          parentDealerId: user.parentDealerId,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.username = (user as any).username;
        token.accountType = (user as any).accountType;
        token.isAdmin = (user as any).isAdmin;
        token.approved = (user as any).approved;
        token.parentDealerId = (user as any).parentDealerId ?? null;
        token.role = (user as any).role ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).accountType = token.accountType;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).approved = token.approved;
        (session.user as any).parentDealerId = token.parentDealerId ?? null;
        (session.user as any).role = token.role ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
