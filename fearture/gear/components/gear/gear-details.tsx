"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  Star,
  ShoppingCart,
  PackageCheck,
  ShieldCheck,
  CalendarDays,
  Minus,
  Plus,
  Loader2,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ReviewSection, type ReviewData } from "./review-section"
import { createRentalOrderAction } from "@/fearture/rental-order/actions/createRental.action"

export type GearStatus = "AVAILABLE" | "UNAVAILABLE" | "OUT_OF_STOCK"

export interface GearDetail {
  id: string
  name: string
  description: string
  rentPricePerDay: number
  discountPrice: number
  stock: number
  brand: string
  availableStock: number
  status: GearStatus
  image: string
}

interface GearDetailsProps {
  gear: GearDetail
  reviews: ReviewData
  className?: string
}

const DURATIONS = [1, 2, 3, 5, 7, 14, 30]

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n)
}

function InlineStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 300, damping: 14 }}
        >
          <Star
            className={cn(
              "size-4",
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        </motion.span>
      ))}
    </div>
  )
}

export function GearDetails({
  gear,
  reviews,
  className,
}: GearDetailsProps) {
  const router = useRouter()

  // Default pickup date set to today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0]
  
  const [quantity, setQuantity] = useState(1)
  const [duration, setDuration] = useState("3")
  const [pickupDate, setPickupDate] = useState(todayStr)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isAvailable = gear.status === "AVAILABLE" && gear.availableStock > 0
  const hasDiscount = gear.discountPrice > 0
  const discountedDaily = hasDiscount
    ? Math.round(gear.rentPricePerDay - gear.discountPrice)
    : gear.rentPricePerDay

  const days = Number(duration)
  const total = useMemo(
    () => discountedDaily * quantity * days,
    [discountedDaily, quantity, days],
  )

  const decQty = () => setQuantity((q) => Math.max(1, q - 1))
  const incQty = () => setQuantity((q) => Math.min(gear.availableStock, q + 1))

  const handleCheckout = async () => {
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const start = new Date(pickupDate)
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000)

      const payload = {
        pickupDate: start.toISOString(),
        returnDate: end.toISOString(),
        items: [
          {
            gearItemId: gear.id,
            quantity: quantity,
          },
        ],
      }

      const res = await createRentalOrderAction(payload)

      if (res.success || res.statuscode === 201) {
        // Direct to Customer Dashboard Rentals page
        router.push("/customer-dashboard/rental")
      } else {
        setErrorMsg(res.message || "Failed to create rental order. Please try again.")
      }
    } catch (err) {
      console.error("Order creation failed", err)
      setErrorMsg("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-8 lg:grid-cols-2 lg:gap-12"
      >
        {/* LEFT: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-xl shadow-black/5 ring-1 ring-inset ring-white/10"
        >
          <Image
            src={gear.image || "/placeholder.svg"}
            alt={gear.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {hasDiscount && (
            <Badge className="absolute left-4 top-4 bg-primary px-3 py-1 text-primary-foreground shadow-lg">
              Save {Math.round((gear.discountPrice / gear.rentPricePerDay) * 100)}%
            </Badge>
          )}
        </motion.div>

        {/* RIGHT: Info */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
              {gear.brand}
            </Badge>
            <h1 className="text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {gear.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <InlineStars rating={reviews.averageRating} />
              <span className="text-sm font-medium text-foreground">
                {reviews.averageRating?.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({reviews.reviews?.length || 0} reviews)
              </span>
            </div>

            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {gear.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge
                variant={isAvailable ? "default" : "destructive"}
                className={cn(
                  "gap-1.5 px-3 py-1",
                  isAvailable && "bg-primary/10 text-primary",
                )}
              >
                <PackageCheck className="size-3.5" />
                {isAvailable ? "Available" : "Unavailable"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {gear.availableStock} of {gear.stock} in stock
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {formatPrice(discountedDaily)}
              </span>
              <span className="mb-1 text-sm text-muted-foreground">/ day</span>
              {hasDiscount && (
                <span className="mb-1 text-sm text-muted-foreground line-through">
                  {formatPrice(gear.rentPricePerDay)}
                </span>
              )}
            </div>

            {/* Trust row */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Insured rentals
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-primary" /> Flexible durations
              </span>
            </div>

            {/* Primary action (Mobile view) */}
            <div className="mt-6 flex gap-3 lg:hidden">
              <Button
                size="lg"
                disabled={!isAvailable || isLoading}
                onClick={handleCheckout}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShoppingCart className="size-4" />
                )}
                {isLoading ? "Processing..." : "Rent Now"}
              </Button>
            </div>
          </motion.div>

          {/* Sticky rental card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-6 lg:sticky lg:top-24"
          >
            <Card className="overflow-hidden border-border/60 bg-card/70 shadow-lg shadow-primary/5 backdrop-blur-md">
              <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price per day</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(discountedDaily)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available stock</span>
                  <span className="font-medium text-foreground">{gear.availableStock}</span>
                </div>

                <Separator />

                {/* Pickup Date */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">Pickup Date</span>
                  <input
                    type="date"
                    min={todayStr}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="h-9 w-36 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Quantity</span>
                  <div className="flex items-center gap-1 rounded-full border border-border p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full"
                      onClick={decQty}
                      disabled={quantity <= 1 || isLoading}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full"
                      onClick={incQty}
                      disabled={quantity >= gear.availableStock || isLoading}
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">Rental duration</span>
                  <Select value={duration} onValueChange={setDuration} disabled={isLoading}>
                    <SelectTrigger className="h-9 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d} {d === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xs text-muted-foreground">
                      {quantity} × {days} {days === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold tracking-tight text-foreground"
                  >
                    {formatPrice(total)}
                  </motion.span>
                </div>

                {errorMsg && (
                  <p className="text-xs text-destructive font-medium text-center">
                    {errorMsg}
                  </p>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    disabled={!isAvailable || isLoading}
                    onClick={handleCheckout}
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="size-4" />
                    )}
                    {isLoading ? "Creating Order..." : "Continue to Checkout"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Reviews */}
      <div className="mt-16">
        <ReviewSection data={reviews} />
      </div>
    </div>
  )
}

export default GearDetails