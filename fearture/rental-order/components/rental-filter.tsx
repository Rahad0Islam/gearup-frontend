"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type FilterTab = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED"

interface RentalFilterProps {
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
  counts: Record<FilterTab, number>
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: "ALL", label: "All Orders" },
  { id: "ACTIVE", label: "Active" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
]

export function RentalFilter({ activeTab, onTabChange, counts }: RentalFilterProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-fit">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        const count = counts[tab.id] ?? 0

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors duration-200 focus:outline-none",
              isActive
                ? "text-slate-900 dark:text-slate-50"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterTab"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            <span
              className={cn(
                "relative z-10 px-1.5 py-0.5 text-[10px] rounded-full transition-colors",
                isActive
                  ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  : "bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}