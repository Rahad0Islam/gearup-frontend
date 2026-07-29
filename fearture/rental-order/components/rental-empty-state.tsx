"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PackageSearch, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RentalEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-12 text-center my-8 backdrop-blur-sm"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 ring-8 ring-emerald-500/5">
        <PackageSearch className="size-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        No rental orders found
      </h3>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        You haven’t placed any rental orders in this view yet. Explore our premium outdoor gear catalog to start your adventure.
      </p>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-6">
        <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20">
          <Link href="/dashboard/customer">
            Browse Gear <ArrowRight className="size-4" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}