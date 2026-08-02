import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5"
            >
              <Skeleton className="mx-auto h-7 w-12 rounded-md" />
              <Skeleton className="mx-auto mt-2 h-3 w-14 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardMetricCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
        >
          <CardContent className="p-5">
            <Skeleton className="size-11 rounded-2xl" />
            <Skeleton className="mt-4 h-4 w-24 rounded-md" />
            <div className="mt-3 flex items-end justify-between gap-4">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DashboardFilterCardSkeleton() {
  return (
    <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="mt-2 h-3 w-72 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
        <div className="flex flex-wrap gap-3 xl:justify-end">
          <Skeleton className="h-11 w-24 rounded-full" />
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPageSkeleton({
  showOverviewCards = false,
  showFilter = true,
  gridSlot,
}: {
  showOverviewCards?: boolean
  showFilter?: boolean
  gridSlot?: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <DashboardHeaderSkeleton />
      {showOverviewCards ? <DashboardMetricCardsSkeleton /> : null}
      {showFilter ? <DashboardFilterCardSkeleton /> : null}
      {gridSlot}
    </div>
  )
}
