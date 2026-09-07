"use client";

import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.assign("/");
      }}
      className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
