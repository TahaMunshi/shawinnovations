import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { GATE_COOKIE } from "@/lib/gate";

export { GATE_COOKIE, safeCallbackPath } from "@/lib/gate";

export type HubSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    isActive: boolean;
  };
};

export function sessionFromName(name: string): HubSession {
  const trimmed = name.trim() || "Guest";
  const email = trimmed.includes("@")
    ? trimmed.toLowerCase()
    : `${trimmed.replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase() || "guest"}@shawinnovations.local`;

  return {
    user: {
      id: "000000000000000000000001",
      email,
      name: trimmed,
      role: "ADMIN",
      isActive: true,
    },
  };
}

export async function getSession(): Promise<HubSession | null> {
  const jar = await cookies();
  const raw = jar.get(GATE_COOKIE)?.value;
  if (!raw) {
    return null;
  }

  try {
    return sessionFromName(decodeURIComponent(raw));
  } catch {
    return sessionFromName(raw);
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  return requireSession();
}
