import { NextResponse } from "next/server";
import { GATE_COOKIE } from "@/lib/gate";

export const runtime = "edge";

export async function POST(request: Request) {
  let username = "";
  let password = "";

  try {
    const body = (await request.json()) as { username?: string; password?: string };
    username = String(body.username ?? "").trim();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Enter a username and password" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: GATE_COOKIE,
    value: encodeURIComponent(username.slice(0, 80)),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
