import { Skeleton } from "@/components/ui/skeleton"
import { GearGridSkeleton } from "@/fearture/gear/components/gear-card-skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-4 rounded-[28px] border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <GearGridSkeleton count={8} />
    </div>
  )
}