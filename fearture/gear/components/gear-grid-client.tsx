"use client"

import { motion } from "motion/react"
import { GearCard, type GearItem } from "./gearCard"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

interface Props {
  items: GearItem[]
}

export function GearGridClient({ items }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {items.map((gear) => (
        <GearCard
          key={gear.id}
          gear={gear}
        />
      ))}
    </motion.div>
  )
}