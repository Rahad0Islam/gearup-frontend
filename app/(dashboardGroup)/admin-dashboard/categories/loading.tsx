import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <Skeleton className="mx-auto h-7 w-10 rounded-md" />
                  <Skeleton className="mx-auto mt-2 h-3 w-12 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-3 w-72 rounded-md" />
              </div>
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-11 max-w-xl rounded-2xl" />
            <div className="overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800">
              <div className="grid grid-cols-12 gap-3 bg-slate-50 px-5 py-3 dark:bg-slate-900/60">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className={`h-3 rounded-md ${
                      index === 0
                        ? "col-span-4 w-16"
                        : index === 1
                          ? "col-span-5 w-24"
                          : index === 2
                            ? "col-span-2 w-16"
                            : "col-span-1 w-12"
                    }`}
                  />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center gap-3 border-t border-slate-200/70 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <Skeleton className="size-10 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-4 w-10 rounded-md" />
                    </div>
                  </div>
                  <div className="col-span-5 space-y-1.5">
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <Skeleton className="size-9 rounded-full" />
                    <Skeleton className="size-9 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}