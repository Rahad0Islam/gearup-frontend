"use client"

import Image from "next/image"
import { motion } from "motion/react"
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Eye,
  PackageCheck,
  Tag,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type GearStatus = "AVAILABLE" | "UNAVAILABLE"

export interface GearItem {
  id: string
  name: string
  brand: string
  description: string
  rentPricePerDay: number
  discountPrice: number
  availableStock: number
  status: GearStatus
  image: string
}

export interface GearCardProps {
  gear: GearItem
  onViewDetails?: (gear: GearItem) => void
  onRentNow?: (gear: GearItem) => void
  className?: string
}

const currency = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
})

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function DiscountBadge({ percentage }: { percentage: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm"
    >
      <Tag className="size-3.5" aria-hidden="true" />
      {percentage}% off
    </motion.span>
  )
}

function AvailabilityBadge({ status }: { status: GearStatus }) {
  const available = status === "AVAILABLE"
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md",
        available
          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300"
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      {available ? "Available" : "Unavailable"}
    </motion.span>
  )
}

export function GearCard({
  gear,
  onViewDetails,
  onRentNow,
  className,
}: GearCardProps) {
  const hasDiscount = gear.discountPrice > 0 && gear.discountPrice < gear.rentPricePerDay
  const activePrice = hasDiscount ? (gear.rentPricePerDay - gear.discountPrice) : gear.rentPricePerDay
  const savings = hasDiscount ? gear.discountPrice : 0
  const discountPercentage = hasDiscount
    ? Math.round((savings / gear.rentPricePerDay) * 100)
    : 0
  const isAvailable = gear.status === "AVAILABLE" && gear.availableStock > 0

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-full", className)}
    >
      <Card className="group/card h-full gap-0 rounded-2xl py-0 shadow-sm ring-1 ring-foreground/10 transition-shadow duration-350 hover:shadow-xl hover:shadow-foreground/5">
        <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl">
          <Image
            src={gear.image || "/placeholder.svg"}
            alt={`${gear.brand} ${gear.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-110"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div>{hasDiscount ? <DiscountBadge percentage={discountPercentage} /> : null}</div>
            <AvailabilityBadge status={isAvailable ? "AVAILABLE" : "UNAVAILABLE"} />
          </div>
        </div>

        <CardHeader className="gap-1.5 px-5 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <PackageCheck className="size-3.5 text-primary" aria-hidden="true" />
            {gear.brand}
          </div>
          <CardTitle className="text-lg leading-snug text-balance">
            {gear.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 px-5 pt-3">
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {/* {gear.description} */}
          </p>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {currency.format(activePrice)}
                </span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>
              {hasDiscount ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground line-through">
                    {currency.format(gear.rentPricePerDay)}
                  </span>
                  <span className="font-medium text-primary">
                    Save {currency.format(savings)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Boxes className="size-3.5" aria-hidden="true" />
              {gear.availableStock} left
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-5 grid grid-cols-2 gap-2.5 rounded-b-2xl border-t bg-muted/40 px-5 py-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => onViewDetails?.(gear)}
          >
            <Eye className="size-4" aria-hidden="true" />
            View Details
          </Button>
          <motion.div whileTap={{ scale: 0.96 }} className="w-full">
            <Button
              className="w-full rounded-xl shadow-sm"
              disabled={!isAvailable}
              onClick={() => onRentNow?.(gear)}
            >
              Rent Now
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default GearCard
