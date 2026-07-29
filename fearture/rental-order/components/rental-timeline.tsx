"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RentalStatus } from "./rental-status-badge"

interface RentalTimelineProps {
  status: RentalStatus
}

const TIMELINE_STEPS: { key: RentalStatus; label: string }[] = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PAID", label: "Paid" },
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "RETURNED", label: "Returned" },
]

const STATUS_INDEX: Record<RentalStatus, number> = {
  PLACED: 0,
  CONFIRMED: 1,
  PAID: 2,
  PICKED_UP: 3,
  RETURNED: 4,
  LATE_RETURN: 3, // Still in picked up phase, but late
  CANCELLED: -1,
}

export function RentalTimeline({ status }: RentalTimelineProps) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-center text-xs text-red-600 dark:text-red-400 font-medium border border-red-200 dark:border-red-900/50">
        This order has been cancelled and timeline tracking is stopped.
      </div>
    )
  }

  const activeIndex = STATUS_INDEX[status] ?? 0

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 dark:bg-slate-800" />

        {/* Animated Active Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500"
          initial={{ width: "0%" }}
          animate={{
            width: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Timeline Steps */}
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex
          const isCurrent = idx === activeIndex
          const isPending = idx > activeIndex

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center group"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                }}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300 border-2",
                  isCompleted &&
                    "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30",
                  isCurrent &&
                    "bg-white dark:bg-slate-900 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/20",
                  isPending &&
                    "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </motion.div>

              <span
                className={cn(
                  "absolute top-8 text-[10px] font-medium whitespace-nowrap transition-colors duration-200",
                  isCurrent && "text-emerald-600 dark:text-emerald-400 font-semibold",
                  isCompleted && "text-slate-700 dark:text-slate-300",
                  isPending && "text-slate-400 dark:text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-4" /> {/* Spacing for step labels */}
    </div>
  )
}