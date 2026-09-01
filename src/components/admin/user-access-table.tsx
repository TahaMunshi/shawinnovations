import Link from "next/link";
import type { Section, User, UserPermission } from "@prisma/client";
import { setUserActiveAction } from "@/app/admin/actions";

type UserWithPermissions = User & {
  permissions: (UserPermission & { section: Section })[];
};

export function UserAccessTable({ users }: { users: UserWithPermissions[] }) {
  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Authorized Users</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-teal-800">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      user.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Revoked"}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{user.email}</p>
                <p className="text-xs text-slate-500">
                  {[user.organization, user.title, user.certification]
                    .filter(Boolean)
                    .join(" · ") || "No profile details"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {user.role === "ADMIN" ? (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                      All sections
                    </span>
                  ) : user.permissions.length === 0 ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800">
                      No section access
                    </span>
                  ) : (
                    user.permissions.map((permission) => (
                      <span
                        key={permission.id}
                        className="rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] text-cyan-900"
                      >
                        {permission.section.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200"
                >
                  Manage
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await setUserActiveAction(user.id, !user.isActive);
                  }}
                >
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      user.isActive
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {user.isActive ? "Revoke access" : "Restore access"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
