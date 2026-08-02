import { Skeleton } from "@/components/ui/skeleton"

export function GearCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-sm ring-1 ring-foreground/10">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 px-5 pt-5">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-5 w-3/4 rounded-md" />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 pt-3">
        <div className="line-clamp-2 space-y-1.5">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 border-t bg-muted/40 px-5 py-4">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function GearGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <GearCardSkeleton key={index} />
      ))}
    </div>
  )
}
