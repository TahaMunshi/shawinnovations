export const GATE_COOKIE = "shaw_hub_access";

export function safeCallbackPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/dashboard";
  }
  return value;
}

export function writeHubCookie(username: string) {
  const value = encodeURIComponent(username.trim().slice(0, 80));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${GATE_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax${secure}`;
}

export function clearHubCookie() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${GATE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
