"use client"

import { motion } from "framer-motion"
import { Clock, CheckCircle2, PackageCheck, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RentalOrder } from "@/fearture/rental-order/types/types"

interface ProviderStatsProps {
  orders: RentalOrder[]
}

export function ProviderOrderStats({ orders }: ProviderStatsProps) {
  const pendingCount = orders.filter((o) => o.status === "PLACED").length
  const readyPickupCount = orders.filter((o) => o.status === "PAID").length
  const activeRentalCount = orders.filter((o) => o.status === "PICKED_UP" || o.status === "LATE_RETURN").length
  const completedCount = orders.filter((o) => o.status === "RETURNED").length

  const stats = [
    {
      title: "Pending Confirmations",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Ready for Pickup",
      value: readyPickupCount,
      icon: PackageCheck,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Currently Rented Out",
      value: activeRentalCount,
      icon: RotateCcw,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Completed Rentals",
      value: completedCount,
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}