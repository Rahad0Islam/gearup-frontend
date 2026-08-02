"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Edit3, Loader2, MessageSquare } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { ReviewDialog } from "@/fearture/review/components/review-dialog"
import {
  getReviewByGearAndUserAction,
  type ReviewData,
} from "@/fearture/review/action/review.action"
import type { RentalOrder } from "@/fearture/rental-order/types/types"

interface ReviewsViewProps {
  initialOrders: RentalOrder[]
}

interface ReviewRow {
  order: RentalOrder
  review: ReviewData | null
  loading: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ReviewsView({ initialOrders = [] }: ReviewsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"ALL" | "REVIEWED" | "PENDING">(
    "ALL"
  )
  const [rows, setRows] = useState<ReviewRow[]>(() =>
    initialOrders.map((o) => ({
      order: o,
      review: null,
      loading: true,
    }))
  )
  const [dialogState, setDialogState] = useState<{
    open: boolean
    orderId: string | null
  }>({ open: false, orderId: null })

  // For each RETURNED order, fetch the customer's existing review
  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (row.loading === false && row.review !== null) continue
        const firstItem = row.order.rentalOrderItems[0]
        const gearItemId = firstItem?.gearItem?.id
        const customerId = row.order.customer?.id
        if (!gearItemId || !customerId) {
          setRows((prev) =>
            prev.map((r, idx) =>
              idx === i ? { ...r, loading: false } : r
            )
          )
          continue
        }

        try {
          const res = await getReviewByGearAndUserAction(gearItemId, customerId)
          if (cancelled) return
          const nextReview: ReviewData | null = res.success
            ? (res.data as ReviewData | null) ?? null
            : null
          setRows((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? {
                    ...r,
                    review: nextReview,
                    loading: false,
                  }
                : r
            )
          )
        } catch (error) {
          if (cancelled) return
          setRows((prev) =>
            prev.map((r, idx) =>
              idx === i ? { ...r, loading: false } : r
            )
          )
        }
      }
    }

    loadAll()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrders])

  const counts = useMemo(
    () => ({
      ALL: rows.length,
      REVIEWED: rows.filter((r) => r.review).length,
      PENDING: rows.filter((r) => !r.review).length,
    }),
    [rows]
  )

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (activeFilter === "REVIEWED" && !row.review) return false
      if (activeFilter === "PENDING" && row.review) return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const gearName =
          row.order.rentalOrderItems[0]?.gearItem?.name?.toLowerCase() || ""
        const orderId = row.order.id.toLowerCase()
        return gearName.includes(query) || orderId.includes(query)
      }
      return true
    })
  }, [rows, activeFilter, searchQuery])

  const openDialogFor = (orderId: string) =>
    setDialogState({ open: true, orderId })

  const closeDialog = () => setDialogState({ open: false, orderId: null })

  const activeRow = rows.find((r) => r.order.id === dialogState.orderId) ?? null

  const handleReviewSaved = (updated: ReviewData) => {
    setRows((prev) =>
      prev.map((r) =>
        r.order.id === updated.rentalOrderId
          ? { ...r, review: updated }
          : r
      )
    )
    closeDialog()
  }

  const handleReviewDeleted = () => {
    if (!activeRow) return
    setRows((prev) =>
      prev.map((r) =>
        r.order.id === activeRow.order.id ? { ...r, review: null } : r
      )
    )
    closeDialog()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            My Reviews
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage the reviews you have left on completed rentals.
          </p>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
          {(
            [
              { key: "ALL", label: "All", count: counts.ALL },
              { key: "REVIEWED", label: "Reviewed", count: counts.REVIEWED },
              { key: "PENDING", label: "Pending", count: counts.PENDING },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === tab.key
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}{" "}
              <span
                className={`ml-1 text-[10px] ${
                  activeFilter === tab.key
                    ? "text-emerald-100"
                    : "text-slate-400"
                }`}
              >
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

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

      {/* List */}
      {filteredRows.length === 0 ? (
        <EmptyState
          hasAny={rows.length > 0}
          filter={activeFilter}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredRows.map((row) => (
              <ReviewRowCard
                key={row.order.id}
                row={row}
                onOpen={() => openDialogFor(row.order.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Shared dialog — keyed to the currently selected order */}
      {activeRow ? (
        <ReviewDialog
          key={activeRow.order.id}
          open={dialogState.open}
          onOpenChange={(open) => {
            if (!open) closeDialog()
          }}
          rentalOrderId={activeRow.order.id}
          gearName={
            activeRow.order.rentalOrderItems[0]?.gearItem?.name || "Equipment"
          }
          existingReview={activeRow.review}
          onSuccess={handleReviewSaved}
          onDeleted={handleReviewDeleted}
        />
      ) : null}
    </div>
  )
}

function ReviewRowCard({
  row,
  onOpen,
}: {
  row: ReviewRow
  onOpen: () => void
}) {
  const firstItem = row.order.rentalOrderItems[0]
  const gear = firstItem?.gearItem

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
        <CardContent className="p-5 space-y-4">
          {/* Gear row */}
          <div className="flex gap-4 items-center">
            <div className="relative size-16 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
              <Image
                src={gear?.image || "/placeholder.svg"}
                alt={gear?.name || "Equipment"}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {gear?.brand || "GearUp"}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {gear?.name || "Rental Equipment"}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Returned on {formatDate(row.order.returnDate)}
              </p>
            </div>

            {row.review ? (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                <Star className="size-3 fill-amber-400 mr-1" /> Reviewed
              </Badge>
            ) : (
              <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                Pending
              </Badge>
            )}
          </div>

          <Separator className="bg-slate-100 dark:bg-slate-800/80" />

          {/* Review content */}
          {row.loading ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-4 justify-center">
              <Loader2 className="size-3.5 animate-spin" />
              Loading review...
            </div>
          ) : row.review ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${
                      star <= row.review!.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
                <span className="ml-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {row.review.rating}/5
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                {row.review.comment}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-2">
              <MessageSquare className="size-3.5" />
              You haven&apos;t reviewed this rental yet.
            </div>
          )}

          {/* Action */}
          <Button
            size="sm"
            onClick={onOpen}
            disabled={row.loading}
            className={`w-full text-xs font-bold rounded-xl gap-1.5 ${
              row.review
                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            }`}
          >
            {row.review ? (
              <>
                <Edit3 className="size-3.5" />
                {row.review ? "Edit / Delete Review" : "Leave Review"}
              </>
            ) : (
              <>
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                Leave a Review
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function EmptyState({
  hasAny,
  filter,
}: {
  hasAny: boolean
  filter: "ALL" | "REVIEWED" | "PENDING"
}) {
  const message = !hasAny
    ? "You don't have any completed rentals yet. Reviews will appear here once a rental is returned."
    : filter === "REVIEWED"
      ? "You haven't reviewed any rentals yet."
      : filter === "PENDING"
        ? "All caught up — no rentals are waiting for a review."
        : "No reviews match your search."

  return (
    <Card className="rounded-3xl border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
        <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Star className="size-5 fill-amber-400 text-amber-400" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          No reviews to show
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          {message}
        </p>
      </CardContent>
    </Card>
  )
}