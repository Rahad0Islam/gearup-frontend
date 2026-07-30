"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Calendar,
  User,
  Check,
  X,
  PackageCheck,
  RotateCcw,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RentalStatusBadge } from "@/fearture/rental-order/components/rental-status-badge"
import {
  confirmOrderAction,
  pickupOrderAction,
  returnOrderAction,
  cancelOrderAction,
} from "@/fearture/provider/actions/provider.action"
import { RentalOrder } from "@/fearture/rental-order/types/types"

interface ProviderOrderCardProps {
  order: RentalOrder
  onStatusUpdated?: (nextStatus?: RentalOrder["status"]) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-BN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ProviderOrderCard({ order, onStatusUpdated }: ProviderOrderCardProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const firstItem = order.rentalOrderItems[0]
  const gear = firstItem?.gearItem

  const handleAction = (
    actionFn: (id: string) => Promise<{ success: boolean; message: string }>,
    successMessage: string,
    nextStatus?: RentalOrder["status"]
  ) => {
    startTransition(async () => {
      const res = await actionFn(order.id)
      if (res.success) {
        toast.success(res.message || successMessage)
        if (nextStatus && onStatusUpdated) {
          onStatusUpdated(nextStatus)
        }
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Order #{order.id.substring(0, 8)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Placed on {formatDate(order.createdAt)}
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
                {gear?.name || "Equipment Rental"}
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

          {/* Customer & Rental Schedule Info */}
          <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">
                Pickup Schedule
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {formatDate(order.pickupDate)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">
                Return Schedule
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {formatDate(order.returnDate)}
              </span>
            </div>
          </div>

          {/* Total Amount & Customer ID */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <User className="size-3.5 text-slate-400" />
              Customer ID: <span className="font-mono font-semibold">{order.customer?.id?.substring(0, 8)}...</span>
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">
              BDT {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </CardContent>

        {/* Dynamic Provider Actions Footer */}
        <CardFooter className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/60">
          {order.status === "PLACED" && (
            <div className="w-full flex gap-2">
              <Button
                disabled={isPending}
                onClick={() => handleAction(confirmOrderAction, "Order confirmed successfully!", "CONFIRMED")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl gap-1.5 shadow-md shadow-emerald-600/20"
              >
                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-4" />}
                Confirm Order
              </Button>
              <Button
                disabled={isPending}
                variant="outline"
                onClick={() => handleAction(cancelOrderAction, "Order cancelled.", "CANCELLED")}
                className="text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/40"
              >
                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-4" />}
                Reject
              </Button>
            </div>
          )}

          {order.status === "CONFIRMED" && (
            <div className="w-full py-2 text-center text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center gap-1.5">
              <Clock className="size-3.5 animate-spin" /> Waiting for Customer Payment
            </div>
          )}

          {order.status === "PAID" && (
            <Button
              disabled={isPending}
              onClick={() => handleAction(pickupOrderAction, "Equipment marked as picked up!", "PICKED_UP")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl gap-2 shadow-md shadow-purple-600/20"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <PackageCheck className="size-4" />}
              Hand Over / Mark Picked Up
            </Button>
          )}

          {order.status === "PICKED_UP" && (
            <Button
              disabled={isPending}
              onClick={() => handleAction(returnOrderAction, "Equipment marked as returned!", "RETURNED")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl gap-2 shadow-md shadow-blue-600/20"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
              Receive Return / Mark Returned
            </Button>
          )}

          {order.status === "RETURNED" && (
            <div className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" /> Rental Completed
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="w-full py-1.5 text-center text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200/60 dark:border-red-900/40 flex items-center justify-center gap-1.5">
              <XCircle className="size-4" /> Order Cancelled
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}