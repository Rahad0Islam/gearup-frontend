"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function RentalCardSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </CardHeader>
      
      <CardContent className="p-5 pt-0 space-y-4">
        <div className="flex gap-4">
          <Skeleton className="size-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />

        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </CardContent>

      <CardFooter className="p-5 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/60">
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardFooter>
    </Card>
  )
}