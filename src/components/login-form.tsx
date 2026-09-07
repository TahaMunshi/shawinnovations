"use client";

import { useState } from "react";
import { safeCallbackPath, writeHubCookie } from "@/lib/gate";

export function LoginForm({
  callbackUrl,
}: {
  callbackUrl?: string;
  error?: string;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const name = username.trim();
    const secret = password;
    if (!name || !secret) {
      setFormError("Enter a username and password.");
      return;
    }

    setPending(true);
    setFormError(null);
    writeHubCookie(name);
    window.location.assign(safeCallbackPath(callbackUrl));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[#101828]">
          Welcome back
          <span className="text-[#0d9488]">.</span>
        </h2>
        <p className="mt-2 text-[15px] text-[#667085]">
          Enter any username and password to continue.
        </p>
      </div>

      {formError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-[#344054]">Username</span>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-premium"
          placeholder="Your name"
          autoComplete="username"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-[#344054]">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-premium"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full px-4 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
