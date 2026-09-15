import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Persona } from "./data";

const SESSION_KEY = "shaw-preview-user";

export type Session = { userId: string; username: string; role: Persona["role"] };
type AuthValue = {
  session: Session | null;
  login: (member: Pick<Persona, "id" | "name" | "role">) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

function readSession(): Session | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<Session>;
    return parsed.userId && parsed.username && parsed.role ? parsed as Session : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const value = useMemo<AuthValue>(
    () => ({
      session,
      login(member) {
        const next = { userId: member.id, username: member.name, role: member.role };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setSession(next);
      },
      logout() {
        sessionStorage.removeItem(SESSION_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

export function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return "/app";
  }
  return value;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }
  return children;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login?returnTo=%2Fadmin" replace />;
  if (session.role !== "admin") return <Navigate to="/app" replace />;
  return children;
}
