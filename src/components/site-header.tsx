import Link from "next/link";
import { auth } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className="container-page">
        <div className="site-header-bar flex h-16 items-center justify-between gap-4 rounded-2xl px-4 sm:px-5">
          <div className="flex min-w-0 items-center">
            <span className="sm:hidden">
              <BrandLogo variant="mark" size="md" priority />
            </span>
            <span className="hidden sm:block">
              <BrandLogo variant="horizontal" size="md" priority />
            </span>
          </div>

          <nav className="hidden items-center gap-1 text-[13px] font-medium text-[#475467] lg:flex">
            {[
              { href: "/#who", label: "Who It's For" },
              { href: "/#ecosystem", label: "Ecosystem" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#security", label: "Security" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-[#f2f4f7] hover:text-[#101828]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {session?.user ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#0f766e] hover:bg-[#e6f7f5] md:inline-flex"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/#access"
                  className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#475467] hover:bg-[#f2f4f7] hover:text-[#101828] md:inline-flex"
                >
                  Request Access
                </Link>
                <Link
                  href="/login"
                  className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
