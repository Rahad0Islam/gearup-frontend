"use client"

import { useEffect, useState, useTransition } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  Receipt,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

import { getPaymentHistory } from "@/fearture/rental-order/actions/getPaymentHistory"
import type {
  PaymentRecord,
  PaymentMeta,
  PaymentQueryParams,
} from "@/fearture/rental-order/types/payment"

interface PaymentHistoryViewProps {
  title?: string
  description?: string
}

export function PaymentHistoryView({
  title = "Payment History",
  description = "View and manage all transactions, rental bookings, and fee settlements.",
}: PaymentHistoryViewProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [meta, setMeta] = useState<PaymentMeta>({ page: 1, limit: 10, total: 0, totalPage: 1 })
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [paymentType, setPaymentType] = useState<string>("ALL")
  const [status, setStatus] = useState<string>("ALL")
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  const fetchPayments = (params: PaymentQueryParams) => {
    startTransition(async () => {
      const response = await getPaymentHistory(params)
      if (response.success) {
        setPayments(response.data)
        setMeta(response.meta)
      } else {
        toast.error("Failed to load payment history.")
      }
    })
  }

  useEffect(() => {
    fetchPayments({ paymentType, status, limit, page })
  }, [paymentType, status, limit, page])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalSpent = payments.reduce((acc, curr) => acc + (curr.status === "PAID" ? curr.amount : 0), 0)
  const rentalPaymentsCount = payments.filter((p) => p.paymentType === "RENTAL").length
  const lateFeePaymentsCount = payments.filter((p) => p.paymentType === "LATE_FEE").length

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spent (Page)</p>
              <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-50">
                BDT {totalSpent.toLocaleString()}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rental Payments</p>
              <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-50">{rentalPaymentsCount}</h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Receipt className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Late Fee Payments</p>
              <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-50">{lateFeePaymentsCount}</h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="flex flex-col items-stretch justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter className="size-4 text-emerald-500" /> Filter Transactions
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={paymentType} onValueChange={(val) => { setPaymentType(val); setPage(1); }}>
              <SelectTrigger className="h-9 w-35 rounded-xl border-slate-200 text-xs dark:border-slate-800">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="RENTAL">Rental</SelectItem>
                <SelectItem value="LATE_FEE">Late Fee</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger className="h-9 w-32.5 rounded-xl border-slate-200 text-xs dark:border-slate-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={limit.toString()} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
              <SelectTrigger className="h-9 w-36 rounded-xl border-slate-200 text-xs dark:border-slate-800">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
              <TableRow className="border-slate-200/80 dark:border-slate-800">
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Transaction Details</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Type</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Method</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Date & Time</TableHead>
                <TableHead className="text-right text-xs font-bold text-slate-600 dark:text-slate-400">Amount</TableHead>
                <TableHead className="text-center text-xs font-bold text-slate-600 dark:text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-40 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 rounded-lg" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="mx-auto h-4 w-16 rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-xs text-slate-500 dark:text-slate-400">
                    No payment records found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-slate-200/60 transition-colors hover:bg-slate-50/50 dark:border-slate-800/60 dark:hover:bg-slate-900/50"
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          <span>{record.transactionId || "N/A"}</span>
                          {record.transactionId && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(record.transactionId, "Transaction ID")}
                              className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {copiedId === record.transactionId ? (
                                <Check className="size-3 text-emerald-500" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                          Order: {record.rentalOrderId.slice(0, 18)}...
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${record.paymentType === "RENTAL" ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"}`}
                      >
                        {record.paymentType}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{record.paymentMethod}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(record.createdAt).toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        BDT {record.amount.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${record.status === "PAID" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300" : record.status === "PENDING" ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"}`}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200/70 px-5 py-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing page {meta.page} of {meta.totalPage} with {meta.limit} rows per page.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(meta.totalPage, 5) }, (_, index) => {
                const pageNumber = index + 1
                const isActive = pageNumber === page

                return (
                  <Button
                    key={pageNumber}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 min-w-9 rounded-full px-3 ${isActive ? "border-slate-950 bg-slate-950 text-white hover:bg-slate-900 dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300" : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"}`}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(meta.totalPage || 1, prev + 1))}
              disabled={page >= (meta.totalPage || 1)}
              className="rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}