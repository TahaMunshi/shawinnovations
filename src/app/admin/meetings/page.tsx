import Link from "next/link";
import { format } from "date-fns";
import { createMeetingAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AdminMeetingsPage() {
  await requireAdmin();

  const [meetings, users, sections] = await Promise.all([
    prisma.meeting.findMany({
      include: {
        section: true,
        access: { include: { user: true } },
        minutes: true,
      },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.section.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const zoomConfigured = Boolean(
    process.env.ZOOM_ACCOUNT_ID &&
      process.env.ZOOM_CLIENT_ID &&
      process.env.ZOOM_CLIENT_SECRET,
  );

  return (
    <div className="premium-shell container-page py-12">
      <Link href="/admin" className="text-sm font-medium text-teal-700">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Zoom Meeting Manager</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Schedule collective meetings and grant join access to selected users.
        {!zoomConfigured && (
          <span className="mt-2 block rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Zoom API credentials are not configured yet. Meetings will be created in
            local/demo mode until ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET
            are added to the environment.
          </span>
        )}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Schedule Meeting</h2>
          <form action={createMeetingAction} className="space-y-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                name="description"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Panel (optional)</span>
              <select
                name="sectionId"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="">All invited users</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Start time</span>
              <input
                type="datetime-local"
                name="scheduledAt"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Duration (minutes)</span>
              <input
                type="number"
                name="durationMin"
                defaultValue={60}
                min={15}
                max={480}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-700">
                Invite users
              </legend>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="userIds" value={user.id} />
                    <span>
                      {user.name}{" "}
                      <span className="text-slate-500">({user.email})</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Create Zoom meeting
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Scheduled Meetings</h2>
          <div className="space-y-3">
            {meetings.length === 0 && (
              <p className="text-sm text-slate-500">No meetings created yet.</p>
            )}
            {meetings.map((meeting) => (
              <article
                key={meeting.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{meeting.title}</h3>
                    <p className="text-sm text-slate-600">
                      {format(meeting.scheduledAt, "PPpp")} · {meeting.durationMin} min
                    </p>
                    <p className="text-xs text-slate-500">
                      {meeting.section?.name || "Cross-panel meeting"} · Meeting ID{" "}
                      {meeting.zoomMeetingId}
                    </p>
                  </div>
                  {meeting.zoomJoinUrl && (
                    <a
                      href={meeting.zoomJoinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-teal-700"
                    >
                      Open Zoom link
                    </a>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meeting.access.map((access) => (
                    <span
                      key={access.id}
                      className="rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] text-cyan-900"
                    >
                      {access.user.name}
                    </span>
                  ))}
                </div>
                {meeting.minutes && (
                  <p className="mt-2 text-sm text-slate-600">
                    Minutes: {meeting.minutes.summary || meeting.minutes.content}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
