import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserAccessTable } from "@/components/admin/user-access-table";

export default async function AdminPage() {
  await requireAdmin();

  const [users, sections, meetings, logs] = await Promise.all([
    prisma.user.findMany({
      include: {
        permissions: {
          where: { isActive: true, revokedAt: null },
          include: { section: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.section.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.meeting.findMany({
      include: { section: true, access: true },
      orderBy: { scheduledAt: "desc" },
      take: 8,
    }),
    prisma.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="premium-shell container-page py-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Administrative Panel</p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-[-0.04em] text-[#101828] sm:text-4xl">
            Platform Control Center
            <span className="text-[#0d9488]">.</span>
          </h1>
          <p className="mt-2 text-slate-600">
            View users, assign section permissions, revoke access, and manage Zoom meetings.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/meetings"
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Manage Meetings
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Member View
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Authorized users" value={users.filter((u) => u.isActive).length} />
        <Stat label="Protected sections" value={sections.filter((s) => !s.isBlank).length} />
        <Stat label="Blank future panels" value={sections.filter((s) => s.isBlank).length} />
        <Stat label="Tracked meetings" value={meetings.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <UserAccessTable users={users} />
        <CreateUserForm />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Meetings</h2>
            <Link href="/admin/meetings" className="text-sm font-semibold text-teal-700">
              Open manager
            </Link>
          </div>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{meeting.title}</p>
                <p className="text-sm text-slate-600">
                  {format(meeting.scheduledAt, "PPpp")} · {meeting.access.length} invitees
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Security Audit Trail</h2>
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-900">{log.action}</p>
                <p className="text-xs text-slate-500">
                  {log.actor?.name || "System"} · {format(log.createdAt, "PPp")}
                </p>
                {log.details && (
                  <p className="mt-1 text-sm text-slate-600">{log.details}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 card-glow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-teal-700">{value}</p>
    </div>
  );
}
