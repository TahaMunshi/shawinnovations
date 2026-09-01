import Link from "next/link";
import { auth } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="container-page">
        <div className="site-header-bar flex h-[4.35rem] items-center justify-between gap-6 px-5 sm:px-7">
          <div className="header-logo-glow flex min-w-0 items-center">
            <span className="sm:hidden">
              <BrandLogo variant="mark" size="md" priority />
            </span>
            <span className="hidden sm:block">
              <BrandLogo variant="horizontal" size="md" priority />
            </span>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {[
              { href: "/#who", label: "Who It's For" },
              { href: "/#ecosystem", label: "Ecosystem" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#security", label: "Security" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
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
                    className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#00a892] hover:bg-[#e8fffa] md:inline-flex"
                  >
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="dashboard-pill">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/#access"
                  className="nav-link hidden md:inline-flex"
                >
                  Request Access
                </Link>
                <Link href="/login" className="dashboard-pill">
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
