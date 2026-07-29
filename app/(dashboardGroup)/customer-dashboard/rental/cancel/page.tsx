"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden text-center">
          <CardContent className="p-8 space-y-6">
            {/* Cancel Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
              className="mx-auto size-20 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center"
            >
              <XCircle className="size-10" />
            </motion.div>

            {/* Header Text */}
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Payment Cancelled
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Your payment session was cancelled. No money was deducted from your card or account.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-left text-xs space-y-1">
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Need help completing your rental?
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                You can retry your payment at any time directly from your rental dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button
                asChild
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl gap-2 shadow-md py-5 text-xs"
              >
                <Link href="/customer-dashboard/rental">
                  <RefreshCw className="size-3.5" /> Return to My Rentals
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold py-5"
              >
                <Link href="/customer-dashboard/rental">
                  <ArrowLeft className="size-3.5" /> Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}