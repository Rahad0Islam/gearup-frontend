"use client"

import { motion } from "motion/react"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export interface Review {
  rating: number
  comment: string
  customer?: {
    name: string
  }
  createdAt?: string
}

export interface ReviewData {
  averageRating: number
  reviews: Review[]
}

interface ReviewSectionProps {
  data: ReviewData
  className?: string
}

/* ---------- Star display ---------- */

function StarRating({
  rating,
  size = 16,
  animate = false,
}: {
  rating: number
  size?: number
  animate?: boolean
}) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating)
        const StarEl = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40",
            )}
          />
        )
        if (!animate) return <span key={i}>{StarEl}</span>
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 15 }}
          >
            {StarEl}
          </motion.span>
        )
      })}
    </div>
  )
}

function formatReviewDate(date?: string) {
  if (!date) return ""

  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  })
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/* ---------- Main component ---------- */

export function ReviewSection({ data, className }: ReviewSectionProps) {
  const { averageRating, reviews } = data
  const total = reviews.length

  return (
    <section className={cn("w-full", className)} aria-labelledby="reviews-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-foreground">
          Customer Reviews
        </h2>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-6"
      >
        <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-10">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-semibold tracking-tight text-foreground">
                  {averageRating?.toFixed(1)}
                </span>
                <span className="mb-1.5 text-sm text-muted-foreground">/ 5</span>
              </div>
              <StarRating rating={averageRating} size={18} animate />
              <p className="text-sm text-muted-foreground">
                Based on {total} review{total === 1 ? "" : "s"}
              </p>
            </div>

            <Separator orientation="vertical" className="hidden h-20 sm:block" />
            <Separator className="sm:hidden" />

            <div className="flex w-full flex-1 flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.round(r.rating) === star).length
                const pct = total ? (count / total) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="flex w-6 items-center gap-0.5 text-xs text-muted-foreground">
                      {star}
                    </span>
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-amber-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Review cards */}
      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {reviews.map((review, i) => {
          const author = review.customer?.name || ""
          const date = formatReviewDate(review.createdAt)
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full border-border/60 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-primary/10 font-medium text-primary">
                        {initials(author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{author}</span>
                      <span className="text-xs text-muted-foreground">{date}</span>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={review.rating} size={14} />
                    </div>
                  </div>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

export default ReviewSection


