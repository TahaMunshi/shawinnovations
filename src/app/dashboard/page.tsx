import Link from "next/link";
import { Video } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import { SignOutButton } from "@/components/sign-out-button";
import { SECTION_CATALOG } from "@/lib/sections-catalog";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const sections = SECTION_CATALOG;

  return (
    <div className="premium-shell container-page py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.12em] text-[#0f766e]">
            MEMBER DASHBOARD
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#101828]">
            Welcome, {session.user.name}
            <span className="text-[#0d9488]">.</span>
          </h1>
          <p className="mt-2 text-[15px] text-[#667085]">
            You only see the collaboration panels assigned to your account.
          </p>
        </div>
        <div className="flex gap-2">
          {session.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-full bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Open Admin Panel
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="soft-card-solid rounded-[1.5rem] p-5">
          <p className="text-sm text-[#667085]">Accessible panels</p>
          <p className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#0f766e]">
            {sections.length}
          </p>
        </div>
        <div className="soft-card-solid rounded-[1.5rem] p-5">
          <p className="text-sm text-[#667085]">Role</p>
          <p className="font-display mt-2 text-2xl font-bold tracking-[-0.03em] text-[#101828]">
            {session.user.role}
          </p>
        </div>
        <div className="soft-card-solid rounded-[1.5rem] p-5">
          <p className="text-sm text-[#667085]">Upcoming meetings</p>
          <p className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#0d9488]">
            0
          </p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="font-display mb-4 text-2xl font-bold tracking-[-0.03em] text-[#101828]">
          Your Panels
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/sections/${section.slug}`}
              className="soft-card-solid group rounded-[1.6rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(16,24,40,0.08)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f7fa] text-[#0f766e] transition group-hover:bg-[#e6f7f5]">
                <SectionIcon name={section.icon} />
              </div>
              <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#101828]">
                {section.name}
              </h3>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
                {section.category}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#667085]">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 flex items-center gap-2 text-2xl font-bold tracking-[-0.03em] text-[#101828]">
          <Video className="h-5 w-5 text-[#0f766e]" />
          Meetings Available to You
        </h2>
        <p className="soft-card-solid rounded-[1.5rem] p-5 text-sm text-[#667085]">
          No upcoming meetings assigned.
        </p>
      </section>
    </div>
  );
}
