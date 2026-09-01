import { createUserAction } from "@/app/admin/actions";

export function CreateUserForm() {
  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Add Authorized User</h2>
      <form action={createUserAction} className="space-y-3">
        <Field name="name" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="password" label="Temporary password" type="password" required />
        <Field name="organization" label="Organization" />
        <Field name="title" label="Title" />
        <Field name="certification" label="Certification (sonographers)" />
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Role</span>
          <select
            name="role"
            defaultValue="MEMBER"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Create user
        </button>
      </form>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
      />
    </label>
  );
}
