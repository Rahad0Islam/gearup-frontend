import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="pt-30">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <div className="flex gap-2 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="size-16 rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>

            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="size-4 rounded-md" />
              ))}
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>

            <Skeleton className="h-20 w-full rounded-2xl" />

            <div className="space-y-2 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-8 w-40 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-11 w-32 rounded-xl" />
              <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-md" />
          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-2xl border border-slate-200/80 p-5 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-5/6 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}