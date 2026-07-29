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
  ArrowUpRight,
  ShieldCheck,
  Clock,
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
import type { PaymentRecord, PaymentMeta, PaymentQueryParams } from "@/fearture/rental-order/types/payment"

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [meta, setMeta] = useState<PaymentMeta>({ page: 1, limit: 10, total: 0, totalPage: 1 })
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filter States
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

  // Trigger re-fetch on filter changes
  useEffect(() => {
    fetchPayments({
      paymentType,
      status,
      limit,
      page,
    })
  }, [paymentType, status, limit, page])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Calculated Metrics from current dataset
  const totalSpent = payments.reduce((acc, curr) => acc + (curr.status === "PAID" ? curr.amount : 0), 0)
  const rentalPaymentsCount = payments.filter((p) => p.paymentType === "RENTAL").length
  const lateFeePaymentsCount = payments.filter((p) => p.paymentType === "LATE_FEE").length

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Payment History
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          View and manage all transactions, rental bookings, and fee settlements.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spent (Page)</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">
                BDT {totalSpent.toLocaleString()}
              </h3>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rental Payments</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">
                {rentalPaymentsCount}
              </h3>
            </div>
            <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Late Fee Payments</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">
                {lateFeePaymentsCount}
              </h3>
            </div>
            <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter className="size-4 text-emerald-500" /> Filter Transactions
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Payment Type Filter */}
            <Select value={paymentType} onValueChange={(val) => { setPaymentType(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-9 rounded-xl text-xs border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="RENTAL">Rental</SelectItem>
                <SelectItem value="LATE_FEE">Late Fee</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger className="w-[130px] h-9 rounded-xl text-xs border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Page Limit Select */}
            <Select value={limit.toString()} onValueChange={(val) => { setLimit(Number(val)); setPage(1); }}>
              <SelectTrigger className="w-[110px] h-9 rounded-xl text-xs border-slate-200 dark:border-slate-800">
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

      {/* Transactions Table */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
              <TableRow className="border-slate-200/80 dark:border-slate-800">
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Transaction Details</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Type</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Method</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400">Date & Time</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 text-right">Amount</TableHead>
                <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 text-center">Status</TableHead>
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
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 mx-auto rounded-lg" /></TableCell>
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
                    className="border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    {/* Transaction ID & Rental Order ID */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          <span>{record.transactionId || "N/A"}</span>
                          {record.transactionId && (
                            <button
                              onClick={() => copyToClipboard(record.transactionId, "Transaction ID")}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                              {copiedId === record.transactionId ? (
                                <Check className="size-3 text-emerald-500" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          Order: {record.rentalOrderId.slice(0, 18)}...
                        </div>
                      </div>
                    </TableCell>

                    {/* Payment Type */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold rounded-lg px-2 py-0.5 ${
                          record.paymentType === "RENTAL"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                        }`}
                      >
                        {record.paymentType}
                      </Badge>
                    </TableCell>

                    {/* Payment Method */}
                    <TableCell className="capitalize text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="size-3.5 text-emerald-500" />
                        {record.paymentMethod}
                      </span>
                    </TableCell>

                    {/* Payment Date */}
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                      <div>
                        {new Date(record.paymentDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(record.paymentDate).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right text-sm font-black text-slate-900 dark:text-slate-50">
                      BDT  {record.amount.toLocaleString()}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-center">
                      <Badge
                        className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                          record.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400"
                        }`}
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

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Page <span className="font-bold text-slate-900 dark:text-slate-100">{meta.page}</span> of{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">{meta.totalPage || 1}</span> ({meta.total} records total)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1 || isPending}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-xl h-8 text-xs border-slate-200 dark:border-slate-800"
            >
              <ChevronLeft className="size-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPage || isPending}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl h-8 text-xs border-slate-200 dark:border-slate-800"
            >
              Next <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}