import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE } from "@/lib/gate";
import type { StagingRole } from "@/lib/staging-data";

export { GATE_COOKIE, safeCallbackPath } from "@/lib/gate";

export type HubSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: StagingRole;
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
      id: "guest-1",
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
