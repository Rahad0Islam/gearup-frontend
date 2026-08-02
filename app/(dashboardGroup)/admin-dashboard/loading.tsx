import { DashboardPageSkeleton } from "@/fearture/dashboard/components/dashboard-page-skeleton"
import { AdminUsersTableSkeleton } from "@/fearture/admin/components/admin-users-table-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <DashboardPageSkeleton
        showOverviewCards
        gridSlot={
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-10 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              ))}
            </div>
            <AdminUsersTableSkeleton rows={6} />
          </>
        }
      />
    </div>
  )
}