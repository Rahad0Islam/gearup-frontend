"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Star,
  Eye,
  CreditCard,
  PackageCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RentalStatusBadge, type RentalStatus } from "./rental-status-badge"
import { RentalTimeline } from "./rental-timeline"
import { PaymentDialog } from "./payment-dialog"
import { toast } from "sonner"
import { RentalOrder } from "../types/types"


interface RentalCardProps {
  order: RentalOrder
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-BN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function RentalCard({ order }: RentalCardProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const firstItem = order.rentalOrderItems[0]
  const gear = firstItem?.gearItem

  const isLateReturn = order.status === "LATE_RETURN"

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
          {/* Header */}
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Order #{order.id.substring(0, 8)}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <RentalStatusBadge status={order.status} />
          </CardHeader>

          {/* Body */}
          <CardContent className="p-5 space-y-4">
            {/* Gear Brief */}
            <div className="flex gap-4 items-center">
              <div className="relative size-20 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex-shrink-0 group">
                <Image
                  src={gear?.image || "/placeholder.svg"}
                  alt={gear?.name || "Equipment"}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {gear?.brand || "GearUp"}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                  {gear?.name || "Rental Equipment"}
                </h3>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="size-3.5 text-slate-400" />
                    {firstItem?.daysRented || 1} {firstItem?.daysRented === 1 ? "day" : "days"}
                  </span>
                  <span>•</span>
                  <span className="font-medium">Qty: {firstItem?.quantity || 1}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100 dark:bg-slate-800/80" />

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">
                  Pickup Date
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {formatDate(order.pickupDate)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">
                  Return Date
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {formatDate(order.returnDate)}
                </span>
              </div>
            </div>

            {/* Visual Order Timeline */}
            <RentalTimeline status={order.status} />

            {/* Total Amount Summary */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isLateReturn ? "Outstanding Late Fee" : "Total Rental Cost"}
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                £
                {(isLateReturn ? order.lateFee ?? 0 : order.totalAmount).toLocaleString()}
              </span>
            </div>
          </CardContent>

          {/* Status Specific Actions Footer */}
          <CardFooter className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/60">
            {order.status === "PLACED" && (
              <div className="w-full py-2 text-center text-xs font-semibold text-yellow-900 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-950/50 rounded-xl border border-yellow-300 dark:border-yellow-700/50 flex items-center justify-center gap-1.5 shadow-sm">
                <Clock className="size-3.5 animate-spin text-yellow-600 dark:text-yellow-400" /> ⏳ Waiting for Provider Confirmation
              </div>
            )}

            {order.status === "CONFIRMED" && (
              <div className="w-full space-y-2">
                <Button
                  onClick={() => setPaymentDialogOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <CreditCard className="size-4" /> Make Payment
                </Button>
                <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                  Complete your payment securely using Stripe.
                </p>
              </div>
            )}

            {order.status === "LATE_RETURN" && (
              <div className="w-full space-y-2">
                <Button
                  onClick={() => setPaymentDialogOpen(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl gap-2 shadow-lg shadow-orange-600/20"
                >
                  <AlertTriangle className="size-4 animate-pulse" /> Pay Late Fee (£{order.lateFee})
                </Button>
                <p className="text-[10px] text-center text-orange-600 dark:text-orange-400 font-medium">
                  Overdue by {order.lateDays} {order.lateDays === 1 ? "day" : "days"}. Settle outstanding balance securely.
                </p>
              </div>
            )}

            {order.status === "PAID" && (
              <div className="w-full py-1.5 text-center text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200/60 dark:border-purple-900/40 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="size-4 text-purple-500" /> ✅ Payment Successful — Waiting for Pickup
              </div>
            )}

            {order.status === "PICKED_UP" && (
              <div className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center gap-1.5">
                <PackageCheck className="size-4 text-emerald-500" /> 🎒 Gear Currently in Use
              </div>
            )}

            {order.status === "RETURNED" && (
              <div className="w-full flex gap-2">
                <Button
                  size="sm"
                  onClick={() => toast.info("Review dialog opening...")}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white text-xs font-semibold rounded-xl gap-1.5"
                >
                  <Star className="size-3.5 fill-amber-400 text-amber-400" /> Leave Review
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info(`Viewing details for #${order.id.substring(0, 8)}`)}
                  className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800"
                >
                  <Eye className="size-3.5" /> Details
                </Button>
              </div>
            )}

            {order.status === "CANCELLED" && (
              <div className="w-full py-1.5 text-center text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200/60 dark:border-red-900/40 flex items-center justify-center gap-1.5">
                <XCircle className="size-4" /> ❌ Order Cancelled
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Payment Dialog (Handles both standard RENTAL and LATE_FEE types) */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        rentalOrderId={order.id}
        gearName={gear?.name || "Equipment"}
        amount={isLateReturn ? order.lateFee ?? 0 : order.totalAmount}
        type={isLateReturn ? "LATE_FEE" : "RENTAL"}
        lateDays={order.lateDays ?? undefined}
      />
    </>
  )
}