import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    authSecret: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    authUrl: Boolean(process.env.AUTH_URL || process.env.NEXTAUTH_URL),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    databaseHasName: Boolean(process.env.DATABASE_URL?.includes("/shawinnovations")),
    authUrlValue: process.env.AUTH_URL || process.env.NEXTAUTH_URL || null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || null,
  });
}
