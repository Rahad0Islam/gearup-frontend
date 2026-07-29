"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CreditCard, ShieldCheck, Lock, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createCheckoutSession } from "../actions/checkoutSession"
import { useRouter } from "next/navigation"



interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rentalOrderId: string
  gearName: string
  amount: number
  type: "RENTAL" | "LATE_FEE"
  lateDays?: number
}

export function PaymentDialog({
  open,
  onOpenChange,
  rentalOrderId,
  gearName,
  amount,
  type,
  lateDays,
}: PaymentDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {

    setLoading(true)
    try {

        const response = await createCheckoutSession(rentalOrderId, type);
        //  router.push(response.data);
        window.location.href = response.data;

    } catch (err) {
      toast.error("Payment initiation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isLateFee = type === "LATE_FEE"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
            <CreditCard className="size-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {isLateFee ? "Late Fee Payment" : "Confirm Payment"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            {isLateFee
              ? "Settle your outstanding late return balance securely."
              : "Complete your rental booking payment with Stripe checkout."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Rental Item</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                {gearName}
              </span>
            </div>

            {isLateFee && lateDays && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Overdue Duration</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {lateDays} {lateDays === 1 ? "day" : "days"} late
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Payment Gateway</span>
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="size-3.5 text-emerald-500" /> Stripe Checkout
              </span>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-800" />

            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-900 dark:text-slate-100">Total Amount</span>
              <span className="text-lg text-emerald-600 dark:text-emerald-400">
                BDT  {amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <Lock className="size-3.5 text-slate-400" />
            <span>256-bit encrypted secure transaction powered by Stripe.</span>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-lg shadow-emerald-600/20 flex-1"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CreditCard className="size-4" />
            )}
            {isLateFee ? "Pay Late Fee" : "Continue to Stripe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}