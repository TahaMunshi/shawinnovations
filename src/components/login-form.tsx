"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm({
  callbackUrl,
  error,
}: {
  callbackUrl?: string;
  error?: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    error ? "Unable to sign in. Please try again." : null,
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setFormError(null);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: callbackUrl || "/dashboard",
    });

    setPending(false);

    if (result?.error) {
      setFormError("Unable to sign in. Please try again.");
      return;
    }

    router.push(result?.url || "/dashboard");
    router.refresh();
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
