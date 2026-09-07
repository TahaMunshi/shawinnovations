"use client";

import { SECTION_CATALOG } from "@/lib/sections-catalog";
import { STAGING_USERS } from "@/lib/staging-data";

export function MeetingScheduleForm() {
  const users = STAGING_USERS.filter((user) => user.isActive);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3"
    >
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Title</span>
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Panel (optional)</span>
        <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="">
          <option value="">All invited users</option>
          {SECTION_CATALOG.map((section) => (
            <option key={section.slug} value={section.slug}>
              {section.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Start time</span>
        <input
          type="datetime-local"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">Invite users</legend>
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
          {users.map((user) => (
            <label key={user.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
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
        Staging preview only
      </button>
    </form>
  );
}
