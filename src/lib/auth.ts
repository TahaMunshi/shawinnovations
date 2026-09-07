import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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

type AppToken = {
  id?: string;
  role?: Role;
  isActive?: boolean;
  name?: string | null;
  email?: string | null;
};

function guestEmail(username: string) {
  if (username.includes("@")) {
    return username.toLowerCase();
  }
  const slug = username
    .replace(/[^a-zA-Z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .toLowerCase();
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
      id: "credentials",
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

        return {
          id: "000000000000000000000001",
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
        const nextToken = token as AppToken;
        nextToken.id = user.id!;
        nextToken.role = user.role;
        nextToken.isActive = user.isActive;
        nextToken.name = user.name;
        nextToken.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      const nextToken = token as AppToken;
      if (session.user) {
        session.user.id = nextToken.id ?? "000000000000000000000001";
        session.user.email = nextToken.email ?? session.user.email;
        session.user.name = nextToken.name ?? session.user.name;
        session.user.role = nextToken.role ?? "ADMIN";
        session.user.isActive = nextToken.isActive ?? true;
        session.user.emailVerified = session.user.emailVerified ?? null;
      }
      return session;
    },
  },
});
