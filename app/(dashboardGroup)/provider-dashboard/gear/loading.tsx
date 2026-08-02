import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ProviderGearGridSkeleton } from "@/fearture/provider/components/provider-gear-card-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-9 w-80 rounded-md" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-11 w-44 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="size-9 rounded-full" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3 w-64 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-40 rounded-full" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
          <CardContent className="p-5">
            <ProviderGearGridSkeleton count={6} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}