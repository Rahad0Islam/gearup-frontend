"use client"

import { useEffect, useState, useTransition } from "react"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { AdminCategory, CategoryPayload } from "@/fearture/admin/actions/category.action"
import { createCategoryAction, updateCategoryAction } from "@/fearture/admin/actions/category.action"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategory?: AdminCategory | null
  onSuccess?: (category: AdminCategory, isEditing: boolean) => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  initialCategory,
  onSuccess,
}: CategoryFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(initialCategory)
  const [formData, setFormData] = useState<CategoryPayload>({
    name: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name || "",
        description: initialCategory.description || "",
        image: initialCategory.image || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
      })
    }
  }, [initialCategory, open])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(async () => {
      const payload: CategoryPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image?.trim() || null,
      }

      const result = isEditing && initialCategory
        ? await updateCategoryAction(initialCategory.id, payload)
        : await createCategoryAction(payload)

      if (result.success) {
        toast.success(result.message)
        onOpenChange(false)
        onSuccess?.(
          result.data || {
            id: initialCategory?.id || Date.now().toString(),
            name: payload.name,
            description: payload.description,
            image: payload.image || null,
          },
          isEditing
        )
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <DialogHeader>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            <Sparkles className="size-4" />
            {isEditing ? "Edit Category" : "Create Category"}
          </div>
          <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
            {isEditing ? "Update category details" : "Add a new category"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Keep category names short and clear so providers can find them quickly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Name *</Label>
            <Input
              required
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Hiking Gear"
              className="rounded-xl border-slate-200 text-xs dark:border-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description *</Label>
            <Textarea
              required
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Write a short category description"
              className="min-h-28 rounded-xl border-slate-200 text-xs dark:border-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Image URL</Label>
            <Input
              value={formData.image || ""}
              onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="Optional image URL"
              className="rounded-xl border-slate-200 text-xs dark:border-slate-800"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}