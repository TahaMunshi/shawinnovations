import Link from "next/link";
import { auth } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(16,24,40,0.06)] bg-white/92 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center">
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
                    className="hidden px-3 py-2 text-sm font-semibold text-[#0f766e] hover:text-[#0a1f44] md:inline-flex"
                  >
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="btn-primary px-4 py-2 text-sm font-semibold">
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
                <Link href="/login" className="btn-primary px-4 py-2 text-sm font-semibold">
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
