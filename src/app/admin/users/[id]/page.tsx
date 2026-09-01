import Link from "next/link";
import { notFound } from "next/navigation";
import {
  grantPermissionAction,
  revokePermissionAction,
  setUserActiveAction,
} from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [user, sections] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { section: true },
          orderBy: { section: { sortOrder: "asc" } },
        },
      },
    }),
    prisma.section.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!user) {
    notFound();
  }

  const activeSectionIds = new Set(
    user.permissions.filter((p) => p.isActive && !p.revokedAt).map((p) => p.sectionId),
  );

  return (
    <div className="premium-shell container-page max-w-4xl py-12">
      <Link href="/admin" className="text-sm font-medium text-teal-700">
        ← Back to admin
      </Link>

      <div className="mt-4 rounded-3xl border border-teal-100 bg-white p-6 card-glow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-600">{user.email}</p>
            <p className="mt-2 text-sm text-slate-500">
              {[user.organization, user.title, user.certification]
                .filter(Boolean)
                .join(" · ") || "No additional profile details"}
            </p>
            <div className="mt-3 flex gap-2">
              <Badge>{user.role}</Badge>
              <Badge tone={user.isActive ? "ok" : "bad"}>
                {user.isActive ? "Active" : "Access revoked"}
              </Badge>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await setUserActiveAction(user.id, !user.isActive);
            }}
          >
            <button
              type="submit"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                user.isActive
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              {user.isActive ? "Revoke all access" : "Restore account"}
            </button>
          </form>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-teal-100 bg-white p-5">
        <h2 className="mb-2 text-lg font-bold text-slate-900">Section Permissions</h2>
        <p className="mb-4 text-sm text-slate-600">
          {user.role === "ADMIN"
            ? "Administrators automatically receive access to every protected section."
            : "Grant or revoke individual panel access for this member."}
        </p>

        {user.role === "ADMIN" ? (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Full platform visibility enabled for admin role.
          </div>
        ) : (
          <div className="space-y-2">
            {sections.map((section) => {
              const hasAccess = activeSectionIds.has(section.id);
              return (
                <div
                  key={section.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{section.name}</p>
                    <p className="text-xs text-slate-500">
                      {section.category}
                      {section.isBlank ? " · Reserved blank panel" : ""}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      if (hasAccess) {
                        await revokePermissionAction(user.id, section.id);
                      } else {
                        await grantPermissionAction(user.id, section.id);
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        hasAccess
                          ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                          : "bg-teal-600 text-white"
                      }`}
                    >
                      {hasAccess ? "Revoke" : "Grant access"}
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "bad";
}) {
  const classes =
    tone === "ok"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "bad"
        ? "bg-red-100 text-red-700"
        : "bg-teal-100 text-teal-800";

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${classes}`}>
      {children}
    </span>
  );
}
