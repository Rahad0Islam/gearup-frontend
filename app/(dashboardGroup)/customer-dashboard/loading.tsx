import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 text-slate-900 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-6 w-36 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-40 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="size-9 rounded-full" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
              <div className="border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
              <CardContent className="space-y-4 p-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
              <div className="border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
                <Skeleton className="h-5 w-28 rounded-md" />
              </div>
              <CardContent className="space-y-4 p-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-4 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-44 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
              <Skeleton className="h-9 w-40 rounded-full" />
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900"
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
        </div>
      </div>
    </div>
  )
}