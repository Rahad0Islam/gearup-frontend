"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, ShieldCheck, PackageCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [countdown, setCountdown] = useState(8)

  // 1. Countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // 2. Separate side-effect trigger when countdown hits 0
  useEffect(() => {
    if (countdown === 0) {
      router.push("/customer-dashboard/rental")
    }
  }, [countdown, router])

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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
              className="mx-auto size-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
            >
              <CheckCircle2 className="size-10" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Payment Successful!
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Thank you for your payment. Your booking status has been updated, and your gear is being prepared.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 space-y-2 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5" /> Verified & Paid
                </span>
              </div>
              {sessionId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reference ID</span>
                  <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                    {sessionId.slice(0, 16)}...
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Button
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-lg shadow-emerald-600/20 py-5 text-xs"
              >
                <Link href="/customer-dashboard/rental">
                  <PackageCheck className="size-4" /> Go to My Rentals
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>

              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Auto-redirecting in <span className="font-bold text-emerald-600 dark:text-emerald-400">{countdown}s</span>...
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-400">Loading payment details...</div>}>
      <SuccessContent />
    </Suspense>
  )
}