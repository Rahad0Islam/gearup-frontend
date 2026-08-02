import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function AdminUsersTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3 w-72 rounded-md" />
          </div>
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-slate-800"
          >
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 dark:border-slate-800">
          <Skeleton className="h-4 w-64 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
