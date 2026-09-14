import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPersona, type Persona } from "./data";

const SESSION_KEY = "shaw-preview-user";

export type Session = { userId: string; username: string; role: Persona["role"] };
type AuthValue = {
  session: Session | null;
  login: (userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

function readSession(): Session | null {
  try {
    const userId = sessionStorage.getItem(SESSION_KEY);
    const persona = getPersona(userId ?? undefined);
    return persona ? { userId: persona.id, username: persona.name, role: persona.role } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const value = useMemo<AuthValue>(
    () => ({
      session,
      login(userId) {
        const persona = getPersona(userId);
        if (!persona) return;
        const next = { userId: persona.id, username: persona.name, role: persona.role };
        sessionStorage.setItem(SESSION_KEY, next.userId);
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
  if (!session) return <Navigate to="/login?returnTo=%2Fadmin%2Fteams" replace />;
  if (session.role !== "admin") return <Navigate to="/app" replace />;
  return children;
}
