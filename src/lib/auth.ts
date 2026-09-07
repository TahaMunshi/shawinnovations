import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    isActive: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      isActive: boolean;
      emailVerified?: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    isActive: boolean;
  }
}

function guestEmail(username: string) {
  if (username.includes("@")) {
    return username.toLowerCase();
  }
  const slug = username.replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase();
  return `${slug || "guest"}@shawinnovations.local`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const username = String(rawCredentials?.username ?? "").trim();
        const password = String(rawCredentials?.password ?? "");

        if (!username || !password) {
          return null;
        }

        const admin = await prisma.user.findFirst({
          where: { role: "ADMIN", isActive: true },
          select: { id: true },
        });

        return {
          id: admin?.id ?? "000000000000000000000001",
          email: guestEmail(username),
          name: username,
          role: "ADMIN" as Role,
          isActive: true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.isActive = user.isActive;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.emailVerified = session.user.emailVerified ?? null;
      }
      return session;
    },
  },
});
