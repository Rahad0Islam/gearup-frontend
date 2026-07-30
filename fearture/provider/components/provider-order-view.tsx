"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Inbox } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProviderOrderStats } from "./provider-order-stats"
import { ProviderOrderCard } from "./provider-order-card"
import { RentalOrder } from "@/fearture/rental-order/types/types"

interface ProviderRentalViewProps {
  initialOrders: RentalOrder[]
}

const TAB_FILTERS = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending", value: "PLACED" },
  { label: "Ready Pickup", value: "PAID" },
  { label: "Active Rentals", value: "PICKED_UP" },
  { label: "Completed", value: "RETURNED" },
  { label: "Cancelled", value: "CANCELLED" },
]

export function ProviderRentalView({ initialOrders }: ProviderRentalViewProps) {
  const [orders, setOrders] = useState<RentalOrder[]>(initialOrders)
  const [activeTab, setActiveTab] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // Keep state synchronized with server refreshes
  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  // Instant local updates for smooth user feedback
  const handleOrderStatusUpdate = (orderId: string, newStatus: RentalOrder["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  // Filter orders based on active Tab and search keyword
  const filteredOrders = orders.filter((order) => {
    const gearName = order.rentalOrderItems[0]?.gearItem?.name || ""
    const orderId = order.id

    const matchesSearch =
      gearName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === "ALL" ? true : order.status === activeTab

    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Provider Orders Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Approve reservations, manage gear handovers, and track equipment returns.
        </p>
      </div>

      {/* Metric Counters Header */}
      <ProviderOrderStats orders={orders} />

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs defaultValue="ALL" onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap h-auto gap-1">
            {TAB_FILTERS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs font-bold rounded-xl px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
          <Input
            placeholder="Search equipment or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Animated Cards Grid */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
        >
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
            <Inbox className="size-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No orders found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            There are currently no rental orders matching your selected status filter or search query.
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <ProviderOrderCard
                key={order.id}
                order={order}
                onStatusUpdated={(nextStatus) => {
                  if (nextStatus) {
                    handleOrderStatusUpdate(order.id, nextStatus)
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}