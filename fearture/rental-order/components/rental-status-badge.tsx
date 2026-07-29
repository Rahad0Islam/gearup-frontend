"use client"

import { motion } from "framer-motion"
import {
  Clock,
  CheckCircle2,
  CreditCard,
  PackageCheck,
  RotateCcw,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "LATE_RETURN"
  | "CANCELLED"

interface RentalStatusBadgeProps {
  status: RentalStatus
  className?: string
}

const STATUS_CONFIG: Record<
  RentalStatus,
  {
    label: string
    icon: React.ElementType
    styles: string
    dotStyle: string
  }
> = {
  PLACED: {
    label: "Waiting Confirmation",
    icon: Clock,
    styles:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-700/50",
    dotStyle: "bg-yellow-500",
  },
  CONFIRMED: {
    label: "Payment Required",
    icon: CreditCard,
    styles:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700/50",
    dotStyle: "bg-blue-500 animate-pulse",
  },
  PAID: {
    label: "Payment Completed",
    icon: CheckCircle2,
    styles:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700/50",
    dotStyle: "bg-purple-500",
  },
  PICKED_UP: {
    label: "Currently Renting",
    icon: PackageCheck,
    styles:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50",
    dotStyle: "bg-emerald-500 animate-pulse",
  },
  RETURNED: {
    label: "Completed",
    icon: RotateCcw,
    styles:
      "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/50",
    dotStyle: "bg-slate-400",
  },
  LATE_RETURN: {
    label: "Late Return",
    icon: AlertTriangle,
    styles:
      "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700/50",
    dotStyle: "bg-orange-500 animate-ping",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    styles:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700/50",
    dotStyle: "bg-red-500",
  },
}

export function RentalStatusBadge({ status, className }: RentalStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PLACED
  const Icon = config.icon

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-colors duration-300",
        config.styles,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", config.dotStyle)} />
      <Icon className="size-3.5 shrink-0" />
      <span>{config.label}</span>
    </motion.div>
  )
}