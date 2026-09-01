import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user?.isActive) {
    redirect(params.callbackUrl || "/dashboard");
  }

  return (
    <div className="premium-shell">
      <div className="container-page flex min-h-[75vh] items-center py-14">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="soft-card-solid p-8 sm:p-10">
            <BrandLogo variant="horizontal" size="md" href="/" />
            <p className="eyebrow mt-6">Secure Access</p>
            <h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#101828] sm:text-5xl">
              Member Login
              <span className="text-[#0d9488]">.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#667085]">
              Sign in to access your assigned collaboration panels. Access is
              permission-based and can be revoked by administrators at any time.
            </p>
            <div className="soft-card mt-8 p-4 text-sm">
              <p className="font-display font-bold tracking-[-0.02em] text-[#101828]">
                Demo accounts
              </p>
              <ul className="mt-2 space-y-1.5 text-[#475467]">
                <li>Admin: admin@shawinnovations.com</li>
                <li>Advisor: advisor@shawinnovations.com</li>
                <li>Engineer: engineer@shawinnovations.com</li>
                <li>Password: ShawDemo2026!</li>
              </ul>
            </div>
          </div>

          <div className="soft-card-solid p-8 sm:p-10">
            <div className="mb-8 lg:hidden">
              <BrandLogo variant="horizontal" size="sm" href="/" />
            </div>
            <LoginForm callbackUrl={params.callbackUrl} error={params.error} />
            <p className="mt-6 text-center text-sm text-[#667085]">
              Need access?{" "}
              <a
                href="mailto:admin@shawinnovations.com?subject=Access%20Request%20-%20Shaw%20Innovations"
                className="font-semibold text-[#0f766e] hover:underline"
              >
                Request authorization
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
