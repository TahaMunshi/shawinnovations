import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";
import { safeCallbackPath } from "@/lib/gate";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const nextPath = safeCallbackPath(params.callbackUrl);

  if (session?.user?.isActive) {
    redirect(nextPath);
  }

  return (
    <div className="premium-shell">
      <div className="container-page flex min-h-[75vh] items-center py-14">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="soft-card-solid p-8 sm:p-10">
            <BrandLogo variant="horizontal" size="md" href="/" />
            <p className="eyebrow mt-6">Member Access</p>
            <h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#101828] sm:text-5xl">
              Member Login
              <span className="text-[#0d9488]">.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#667085]">
              Sign in to enter the collaboration hub. Any username and password
              will let you through.
            </p>
          </div>

          <div className="soft-card-solid p-8 sm:p-10">
            <div className="mb-8 lg:hidden">
              <BrandLogo variant="horizontal" size="sm" href="/" />
            </div>
            <LoginForm callbackUrl={nextPath} />
            <p className="mt-6 text-center text-sm text-[#667085]">
              This login is a front-end gate only — no account is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
