import Link from "next/link";
import { format } from "date-fns";
import { Video } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import { SignOutButton } from "@/components/sign-out-button";
import { prisma } from "@/lib/prisma";
import { getUserAccessibleSections } from "@/lib/permissions";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const sections = await getUserAccessibleSections(
    session.user.id,
    session.user.role,
  );

  const meetings = await prisma.meeting.findMany({
    where:
      session.user.role === "ADMIN"
        ? { scheduledAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) } }
        : {
            scheduledAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            access: { some: { userId: session.user.id } },
          },
    include: { section: true },
    orderBy: { scheduledAt: "asc" },
    take: 5,
  });

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
            {meetings.length}
          </p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="font-display mb-4 text-2xl font-bold tracking-[-0.03em] text-[#101828]">
          Your Panels
        </h2>
        {sections.length === 0 ? (
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            No panel access is currently assigned. Contact an administrator if you
            believe this is an error.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.id}
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
        )}
      </section>

      <section>
        <h2 className="font-display mb-4 flex items-center gap-2 text-2xl font-bold tracking-[-0.03em] text-[#101828]">
          <Video className="h-5 w-5 text-[#0f766e]" />
          Meetings Available to You
        </h2>
        <div className="space-y-3">
          {meetings.length === 0 && (
            <p className="soft-card-solid rounded-[1.5rem] p-5 text-sm text-[#667085]">
              No upcoming meetings assigned.
            </p>
          )}
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="soft-card-solid flex flex-col gap-3 rounded-[1.5rem] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display font-bold tracking-[-0.02em] text-[#101828]">
                  {meeting.title}
                </p>
                <p className="text-sm text-[#667085]">
                  {format(meeting.scheduledAt, "PPpp")}
                  {meeting.section ? ` · ${meeting.section.name}` : ""}
                </p>
              </div>
              {meeting.zoomJoinUrl && (
                <a
                  href={meeting.zoomJoinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary rounded-full px-4 py-2 text-center text-sm font-semibold"
                >
                  Join Zoom
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
