"use client"

import { useState, useEffect, useTransition } from "react"
import { Star, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import {
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
  type ReviewData,
} from "@/fearture/review/action/review.action"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rentalOrderId: string
  gearName: string
  existingReview?: ReviewData | null
  onSuccess?: (review: ReviewData) => void
  /**
   * Called when a review is successfully deleted. The parent should clear
   * its local review state so the UI reflects the deletion immediately.
   */
  onDeleted?: (reviewId: string) => void
}

export function ReviewDialog({
  open,
  onOpenChange,
  rentalOrderId,
  gearName,
  existingReview,
  onSuccess,
  onDeleted,
}: ReviewDialogProps) {
  const isEditMode = Boolean(existingReview?.id)

  const [rating, setRating] = useState<number>(5)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Populate fields if in Edit mode
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
      setComment(existingReview.comment)
    } else {
      setRating(5)
      setComment("")
    }
    // Reset transient UI when the dialog opens/closes or the review changes
    setConfirmingDelete(false)
  }, [existingReview, open])

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment for your review")
      return
    }

    startTransition(async () => {
      if (isEditMode && existingReview?.id) {
        // Edit Mode
        const res = await updateReviewAction(existingReview.id, { rating, comment })
        if (res.success && res.data) {
          toast.success(res.message)
          onSuccess?.(res.data)
          onOpenChange(false)
        } else {
          toast.error(res.message)
        }
      } else {
        // Create Mode
        const res = await createReviewAction({
          rentalOrderId,
          rating,
          comment,
        })
        if (res.success && res.data) {
          toast.success(res.message)
          onSuccess?.(res.data)
          onOpenChange(false)
        } else {
          toast.error(res.message)
        }
      }
    })
  }

  const handleDelete = () => {
    if (!existingReview?.id) return

    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }

    setIsDeleting(true)
    startTransition(async () => {
      const res = await deleteReviewAction(existingReview.id)
      if (res.success) {
        toast.success(res.message || "Review deleted successfully")
        onDeleted?.(existingReview.id)
        onOpenChange(false)
      } else {
        toast.error(res.message || "Failed to delete review")
      }
      setIsDeleting(false)
      setConfirmingDelete(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {isEditMode ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Share your experience using <span className="font-semibold text-emerald-600 dark:text-emerald-400">{gearName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Star Rating Input */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Your Rating
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const activeStar = (hoveredRating ?? rating) >= star
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`size-7 transition-colors ${
                        activeStar
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {hoveredRating ?? rating} out of 5 Stars
            </span>
          </div>

          {/* Comment Text Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Review Comment
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the gear quality, condition, and overall service..."
              rows={4}
              className="rounded-xl border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          {isEditMode ? (
            <Button
              type="button"
              variant="outline"
              disabled={isPending || isDeleting}
              onClick={handleDelete}
              className={`rounded-xl text-xs sm:mr-auto border ${
                confirmingDelete
                  ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                  : "border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : confirmingDelete ? (
                <>
                  <Trash2 className="size-3.5 mr-1.5" />
                  Tap again to confirm
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5 mr-1.5" />
                  Delete
                </>
              )}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            disabled={isPending || isDeleting}
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs flex-1 border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || isDeleting}
            onClick={handleSubmit}
            className="rounded-xl text-xs flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                {isEditMode ? "Updating..." : "Submitting..."}
              </>
            ) : isEditMode ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}