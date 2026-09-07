import Link from "next/link";
import { format } from "date-fns";
import { MeetingScheduleForm } from "@/components/admin/meeting-schedule-form";
import { requireAdmin } from "@/lib/session";
import { STAGING_MEETINGS } from "@/lib/staging-data";

export default async function AdminMeetingsPage() {
  await requireAdmin();
  const meetings = STAGING_MEETINGS;

  return (
    <div className="premium-shell container-page py-12">
      <Link href="/admin" className="text-sm font-medium text-teal-700">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Meeting Manager</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Staging preview of collective meetings and invite lists.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Schedule Meeting</h2>
          <MeetingScheduleForm />
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Scheduled Meetings</h2>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <article
                key={meeting.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <h3 className="font-semibold text-slate-900">{meeting.title}</h3>
                <p className="text-sm text-slate-600">
                  {format(new Date(meeting.scheduledAt), "PPpp")} · {meeting.durationMin} min
                </p>
                <p className="text-xs text-slate-500">{meeting.panel}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meeting.invitees.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] text-cyan-900"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
