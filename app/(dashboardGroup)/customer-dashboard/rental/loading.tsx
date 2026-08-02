import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-9 w-72 rounded-md" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </div>

        <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3 w-64 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-44 rounded-full" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="overflow-hidden rounded-3xl border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800/60 dark:bg-slate-950/40">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-3 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-20 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-16 rounded-md" />
                        <Skeleton className="h-4 w-40 rounded-md" />
                        <Skeleton className="h-3 w-28 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                        <Skeleton className="h-3 w-16 rounded-md" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                      </div>
                      <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                        <Skeleton className="h-3 w-16 rounded-md" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-32 rounded-md" />
                      <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                  </CardContent>
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-950/40">
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}