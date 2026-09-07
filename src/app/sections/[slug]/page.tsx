import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import { getCatalogSection } from "@/lib/sections-catalog";
import { requireSession } from "@/lib/session";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireSession();

  const section = getCatalogSection(slug);
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
          <p className="text-sm text-slate-500">No resources published yet.</p>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Milestones</h2>
          <p className="text-sm text-slate-500">No milestones yet.</p>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-teal-100 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Panel Meetings & Minutes</h2>
        <p className="text-sm text-slate-500">No meetings scheduled for this panel.</p>
      </section>
    </div>
  );
}
