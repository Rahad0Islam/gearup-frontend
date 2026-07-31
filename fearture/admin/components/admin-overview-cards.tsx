"use client"

import { motion } from "framer-motion"
import { Building2, ShieldAlert, ShieldCheck, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface AdminOverviewCardsProps {
  totalUsers: number
  customerCount: number
  providerCount: number
  suspendedCount: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  }),
}

const cards = [
  {
    title: "Total Users",
    accent: "from-emerald-500/20 to-teal-500/10",
    icon: Users,
  },
  {
    title: "Customers",
    accent: "from-slate-500/20 to-slate-400/10",
    icon: ShieldCheck,
  },
  {
    title: "Providers",
    accent: "from-cyan-500/20 to-emerald-500/10",
    icon: Building2,
  },
  {
    title: "Suspended",
    accent: "from-amber-500/20 to-rose-500/10",
    icon: ShieldAlert,
  },
] as const

export function AdminOverviewCards({
  totalUsers,
  customerCount,
  providerCount,
  suspendedCount,
}: AdminOverviewCardsProps) {
  const values = [totalUsers, customerCount, providerCount, suspendedCount]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div key={card.title} variants={cardVariants} custom={index}>
            <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
              <CardContent className="p-5">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                  <Icon className="h-5 w-5 text-slate-900 dark:text-white" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {values[index]}
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    Live
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}