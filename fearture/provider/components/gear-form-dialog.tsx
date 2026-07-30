"use client"

import { useState, useEffect, useTransition } from "react"
import Image from "next/image"
import { Loader2, Plus, Edit3, Sparkles, FolderGit, ImageOff } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  createGearAction,
  updateGearAction,
  GearPayload,
  Category,
} from "../actions/gear.action"

export interface GearItem extends GearPayload {
  id: string
  availableStock?: number
  status?: string
}

interface GearFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  initialData?: GearItem | null
  // Pass item and mode back to parent for instant UI update
  onSuccess?: (item: GearItem, isEditing: boolean) => void 
}

function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  const trimmed = url.trim()
  if (trimmed.startsWith("/")) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function GearFormDialog({
  open,
  onOpenChange,
  categories,
  initialData,
  onSuccess,
}: GearFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [imageError, setImageError] = useState(false)
  const isEditing = Boolean(initialData)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [formData, setFormData] = useState<GearPayload>({
    name: "",
    brand: "",
    description: "",
    rentPricePerDay: 0,
    discountPrice: 0,
    stock: 1,
    image: "",
  })

  useEffect(() => {
    setImageError(false)
    if (initialData) {
      setSelectedCategoryId(initialData.categoryId || "")
      setFormData({
        name: initialData.name || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        rentPricePerDay: initialData.rentPricePerDay || 0,
        discountPrice: initialData.discountPrice || 0,
        stock: initialData.stock || 1,
        image: initialData.image || "",
      })
    } else {
      setSelectedCategoryId("")
      setFormData({
        name: "",
        brand: "",
        description: "",
        rentPricePerDay: 0,
        discountPrice: 0,
        stock: 1,
        image: "",
      })
    }
  }, [initialData, open])

  const handleChange = (field: keyof GearPayload, value: any) => {
    if (field === "image") setImageError(false)
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEditing && !selectedCategoryId) {
      toast.error("Please select a category for this gear.")
      return
    }

    startTransition(async () => {
      const payload: GearPayload = {
        ...formData,
        rentPricePerDay: Number(formData.rentPricePerDay),
        discountPrice: Number(formData.discountPrice || 0),
        stock: Number(formData.stock),
      }

      const res =
        isEditing && initialData
          ? await updateGearAction(initialData.id, payload)
          : await createGearAction(selectedCategoryId, payload)

      if (res.success) {
        toast.success(res.message)
        onOpenChange(false)
        // Pass data back to sync state
        onSuccess?.(res.data || { ...payload, id: initialData?.id || Date.now().toString(), categoryId: selectedCategoryId }, isEditing)
      } else {
        toast.error(res.message)
      }
    })
  }

  const finalPrice = Math.max(0, formData.rentPricePerDay - (formData.discountPrice || 0))
  const showImagePreview = isValidImageUrl(formData.image) && !imageError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4" />
            {isEditing ? "Update Inventory" : "New Gear Listing"}
          </div>
          <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
            {isEditing ? "Edit Gear Details" : "Add Gear to Category"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Select a category created by admin and fill in gear specifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 overflow-y-auto pr-1 flex-1">
          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FolderGit className="size-3.5 text-emerald-600" /> Target Category *
            </Label>
            <Select
              disabled={isEditing}
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="w-full rounded-xl border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900">
                <SelectValue placeholder="Select an admin category..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Brand Name *
              </Label>
              <Input
                required
                placeholder="e.g. Black Diamond"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Gear Title *
              </Label>
              <Input
                required
                placeholder="e.g. Climbing Harness"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Rent (BDT) *
              </Label>
              <Input
                type="number"
                min="0"
                required
                placeholder="350"
                value={formData.rentPricePerDay || ""}
                onChange={(e) => handleChange("rentPricePerDay", e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Discount (BDT)
              </Label>
              <Input
                type="number"
                min="0"
                placeholder="40"
                value={formData.discountPrice || ""}
                onChange={(e) => handleChange("discountPrice", e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Total Stock *
              </Label>
              <Input
                type="number"
                min="1"
                required
                placeholder="6"
                value={formData.stock || ""}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
              />
            </div>

            <div className="sm:col-span-3 flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Effective Daily Price:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                BDT {finalPrice.toLocaleString()} / day
              </span>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Image URL *
            </Label>
            <Input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
            />

            <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 mt-2 flex items-center justify-center">
              {showImagePreview ? (
                <Image
                  src={formData.image.trim()}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-2 text-center">
                  <ImageOff className="size-5" />
                  <span className="text-[11px]">
                    {formData.image
                      ? "Unable to load image from URL"
                      : "Enter a valid HTTP/HTTPS image URL"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description *
            </Label>
            <Textarea
              required
              rows={3}
              placeholder="Lightweight climbing harness suitable for indoor and outdoor rock climbing..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-600/20"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEditing ? (
                <>
                  <Edit3 className="size-4" /> Save Changes
                </>
              ) : (
                <>
                  <Plus className="size-4" /> Add Gear Item
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}