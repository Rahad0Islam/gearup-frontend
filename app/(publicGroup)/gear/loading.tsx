import { Skeleton } from "@/components/ui/skeleton"
import { GearGridSkeleton } from "@/fearture/gear/components/gear-card-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 text-slate-900 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5"
                >
                  <Skeleton className="mx-auto h-7 w-10 rounded-md" />
                  <Skeleton className="mx-auto mt-2 h-3 w-12 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-3 w-72 rounded-md" />
          </div>
          <div className="mt-4 space-y-4">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-2xl" />
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <Skeleton className="h-11 w-24 rounded-full" />
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
        </div>

        <GearGridSkeleton count={8} />

        <div className="flex flex-col gap-3 border-t border-slate-200/70 px-1 pt-2 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-4 w-64 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}