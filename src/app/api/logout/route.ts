import { NextResponse } from "next/server";
import { GATE_COOKIE } from "@/lib/gate";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: GATE_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
