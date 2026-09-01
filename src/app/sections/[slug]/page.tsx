import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import { prisma } from "@/lib/prisma";
import { userCanAccessSection } from "@/lib/permissions";
import { requireSession } from "@/lib/session";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await requireSession();

  const allowed = await userCanAccessSection(
    session.user.id,
    session.user.role,
    slug,
  );

  if (!allowed) {
    redirect("/dashboard");
  }

  const section = await prisma.section.findUnique({
    where: { slug },
    include: {
      resources: { orderBy: { createdAt: "desc" } },
      milestones: { orderBy: { dueDate: "asc" } },
      meetings: {
        orderBy: { scheduledAt: "desc" },
        take: 5,
        include: { minutes: true },
      },
    },
  });

  if (!section) {
    notFound();
  }

  return (
    <div className="premium-shell container-page py-12">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mb-8 rounded-3xl border border-teal-100 bg-white p-6 card-glow sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white">
            <SectionIcon name={section.icon} className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              {section.category}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{section.name}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{section.description}</p>
            {section.isBlank && (
              <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Reserved blank panel for future use
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Resources</h2>
          <div className="space-y-3">
            {section.resources.length === 0 && (
              <p className="text-sm text-slate-500">No resources published yet.</p>
            )}
            {section.resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{resource.title}</p>
                <p className="text-xs uppercase tracking-wide text-teal-700">
                  {resource.type}
                </p>
                {resource.description && (
                  <p className="mt-1 text-sm text-slate-600">{resource.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Milestones</h2>
          <div className="space-y-3">
            {section.milestones.length === 0 && (
              <p className="text-sm text-slate-500">No milestones yet.</p>
            )}
            {section.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{milestone.title}</p>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-teal-800">
                    {milestone.status}
                  </span>
                </div>
                {milestone.description && (
                  <p className="mt-1 text-sm text-slate-600">{milestone.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {milestone.dueDate && <span>Due {format(milestone.dueDate, "PP")}</span>}
                  {milestone.cadRef && <span>CAD: {milestone.cadRef}</span>}
                  {milestone.prototypeRef && (
                    <span>Prototype: {milestone.prototypeRef}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-teal-100 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Panel Meetings & Minutes</h2>
        <div className="space-y-3">
          {section.meetings.length === 0 && (
            <p className="text-sm text-slate-500">No meetings scheduled for this panel.</p>
          )}
          {section.meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{meeting.title}</p>
                  <p className="text-sm text-slate-600">
                    {format(meeting.scheduledAt, "PPpp")}
                  </p>
                </div>
                {meeting.zoomJoinUrl && (
                  <a
                    href={meeting.zoomJoinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-teal-700"
                  >
                    Join Zoom
                  </a>
                )}
              </div>
              {meeting.minutes && (
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Minutes: </span>
                  {meeting.minutes.summary || meeting.minutes.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
