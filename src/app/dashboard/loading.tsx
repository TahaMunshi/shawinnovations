export default function DashboardLoading() {
  return (
    <div className="premium-shell container-page py-12">
      <div className="mb-10 h-24 animate-pulse rounded-[1.5rem] bg-[#f2f4f7]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-[1.6rem] bg-[#f2f4f7]"
          />
        ))}
      </div>
    </div>
  );
}
