import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[rgba(16,24,40,0.06)] bg-white/80">
      <div className="container-page flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <BrandLogo variant="horizontal" size="sm" />
          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            A secure collaboration hub for clinicians, engineers, and advisors
            advancing medical device innovation.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
              Explore
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-[#475467]">
              <Link href="/#who" className="hover:text-[#101828]">
                Who It&apos;s For
              </Link>
              <Link href="/#ecosystem" className="hover:text-[#101828]">
                Ecosystem
              </Link>
              <Link href="/#how-it-works" className="hover:text-[#101828]">
                How It Works
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
              Access
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-[#475467]">
              <Link href="/login" className="hover:text-[#101828]">
                Member Login
              </Link>
              <Link href="/#access" className="hover:text-[#101828]">
                Request Access
              </Link>
              <Link href="/#security" className="hover:text-[#101828]">
                Security
              </Link>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
              Legal
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-[#475467]">
              <span>Privacy Notice</span>
              <span>Authorized Use Only</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(16,24,40,0.06)]">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-[#98a2b3] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shaw Innovations. All Rights Reserved.</p>
          <p>Secure · Permission-based · Built for collaboration</p>
        </div>
      </div>
    </footer>
  );
}
