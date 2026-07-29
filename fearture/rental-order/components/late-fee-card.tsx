"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentDialog } from "./payment-dialog"

interface LateFeeCardProps {
  rentalOrderId: string
  gearName: string
  lateDays: number
  lateFee: number
}

export function LateFeeCard({
  rentalOrderId,
  gearName,
  lateDays,
  lateFee,
}: LateFeeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-orange-300 dark:border-orange-800/80 bg-orange-50/80 dark:bg-orange-950/30 p-4 shadow-sm backdrop-blur-sm"
      >
        {/* Subtle orange pulse glow effect */}
        <div className="absolute -right-8 -top-8 size-28 rounded-full bg-orange-500/10 blur-xl pointer-events-none animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="size-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wide">
                Late Return Notice
              </h4>
              <p className="text-[11px] text-orange-700 dark:text-orange-400 mt-0.5">
                This equipment exceeded its scheduled return window.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-orange-200/60 dark:border-orange-900/40 text-center">
          <div>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Late Days</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1 mt-0.5">
              <Clock className="size-3 text-orange-500" /> {lateDays}d
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Fee Rate</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
              £{(lateFee / lateDays).toFixed(0)}/d
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Balance</span>
            <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400 mt-0.5 block">
              £{lateFee}
            </span>
          </div>
        </div>

        <div className="mt-3.5">
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl gap-2 shadow-md shadow-orange-600/20"
          >
            <CreditCard className="size-3.5" /> Pay Late Fee (£{lateFee})
          </Button>
        </div>
      </motion.div>

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rentalOrderId={rentalOrderId}
        gearName={gearName}
        amount={lateFee}
        type="LATE_FEE"
        lateDays={lateDays}
      />
    </>
  )
}