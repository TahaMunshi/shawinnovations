import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const SESSION_KEY = "shaw-preview-user";

type Session = { username: string };
type AuthValue = {
  session: Session | null;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

function readSession(): Session | null {
  try {
    const username = sessionStorage.getItem(SESSION_KEY);
    return username ? { username } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const value = useMemo<AuthValue>(
    () => ({
      session,
      login(username) {
        const next = { username: username.trim() };
        sessionStorage.setItem(SESSION_KEY, next.username);
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
    return "/dashboard";
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
