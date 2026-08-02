import { Logo } from "@/components/logo"
import { Skeleton } from "@/components/ui/skeleton"

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.1),transparent_26%)] px-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <Logo className="opacity-90" />
        </div>

        <div className="relative mx-auto size-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-emerald-500/40" />
          <span className="absolute inset-4 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <span className="size-3 animate-pulse rounded-full bg-white" />
          </span>
        </div>

        <div className="space-y-3">
          <Skeleton className="mx-auto h-4 w-56 rounded-md" />
          <Skeleton className="mx-auto h-3 w-40 rounded-md" />
        </div>

        <p className="text-xs uppercase tracking-[0.4em] text-emerald-600/80 dark:text-emerald-400/80">
          Loading GearUp
        </p>
      </div>
    </div>
  )
}