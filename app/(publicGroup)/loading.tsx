import { Skeleton } from "@/components/ui/skeleton"
import { GearGridSkeleton } from "@/fearture/gear/components/gear-card-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_left_top,rgba(14,165,233,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_left_top,rgba(14,165,233,0.08),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <main className="mx-auto grid min-h-screen max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
        <section className="flex flex-col justify-center gap-8">
          <Skeleton className="h-9 w-56 rounded-full" />

          <div className="max-w-2xl space-y-5">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-12 w-3/4 rounded-md" />
            <Skeleton className="h-12 w-1/2 rounded-md" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur dark:bg-white/5"
              >
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="mt-2 h-3 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </section>

        <aside className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-[32px] border border-border/60 bg-background/90 p-5 shadow-2xl shadow-black/5 backdrop-blur dark:bg-slate-950/80">
            <div className="space-y-4 rounded-[24px] bg-linear-to-br from-emerald-500 via-teal-500 to-sky-600 p-6">
              <Skeleton className="h-4 w-32 rounded-md bg-white/40" />
              <Skeleton className="h-6 w-3/4 rounded-md bg-white/40" />
              <Skeleton className="h-4 w-full rounded-md bg-white/40" />
              <Skeleton className="h-4 w-2/3 rounded-md bg-white/40" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                >
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="mt-2 h-5 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <section id="gear-catalog" className="mx-auto max-w-7xl space-y-6 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="space-y-4 rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 sm:px-8">
          <Skeleton className="h-6 w-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <Skeleton className="h-7 w-10 rounded-md" />
                <Skeleton className="mt-2 h-3 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
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
      </section>
    </div>
  )
}