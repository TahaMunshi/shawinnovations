export const GATE_COOKIE = "shaw_hub_access";

export function safeCallbackPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/dashboard";
  }
  return value;
}
