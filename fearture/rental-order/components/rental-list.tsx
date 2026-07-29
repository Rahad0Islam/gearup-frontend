"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

import { RentalFilter, type FilterTab } from "./rental-filter"
import { RentalEmptyState } from "./rental-empty-state"
import { RentalOrder } from "../types/types"
import { RentalCard } from "./rental-card"

interface RentalListProps {
  initialOrders: RentalOrder[]
}

export function RentalList({ initialOrders = [] }: RentalListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter calculations based on initialOrders prop
  const counts = useMemo(() => {
    return {
      ALL: initialOrders.length,
      ACTIVE: initialOrders.filter((o) =>
        ["PLACED", "CONFIRMED", "PAID", "PICKED_UP", "LATE_RETURN"].includes(o.status)
      ).length,
      COMPLETED: initialOrders.filter((o) => o.status === "RETURNED").length,
      CANCELLED: initialOrders.filter((o) => o.status === "CANCELLED").length,
    }
  }, [initialOrders])

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      // Tab matching
      if (
        activeTab === "ACTIVE" &&
        !["PLACED", "CONFIRMED", "PAID", "PICKED_UP", "LATE_RETURN"].includes(order.status)
      ) {
        return false
      }
      if (activeTab === "COMPLETED" && order.status !== "RETURNED") return false
      if (activeTab === "CANCELLED" && order.status !== "CANCELLED") return false

      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const gearName = order.rentalOrderItems[0]?.gearItem?.name?.toLowerCase() || ""
        const orderId = order.id.toLowerCase()
        return gearName.includes(query) || orderId.includes(query)
      }

      return true
    })
  }, [initialOrders, activeTab, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            My Rentals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track gear rental bookings, status updates, payments, and returns.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <RentalFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by gear or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-sm focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      {/* Grid Content */}
      {filteredOrders.length === 0 ? (
        <RentalEmptyState />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <RentalCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}