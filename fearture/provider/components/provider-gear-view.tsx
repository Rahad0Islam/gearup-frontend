"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  Layers,
  Inbox,
  Loader2,
  AlertTriangle,
  FolderGit,
  ImageOff,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { GearFormDialog, GearItem } from "./gear-form-dialog"
import { deleteGearAction, getCategoriesAction, Category } from "../actions/gear.action"

interface ProviderGearViewProps {
  initialGears: GearItem[]
  initialCategories?: Category[]
  defaultOpenCreate?: boolean
}

function isValidImageUrl(url?: string): boolean {
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

export function ProviderGearView({
  initialGears,
  initialCategories = [],
  defaultOpenCreate = false,
}: ProviderGearViewProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [gears, setGears] = useState<GearItem[]>(initialGears)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL")

  const [dialogOpen, setDialogOpen] = useState(defaultOpenCreate)
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, startDeleteTransition] = useTransition()

  // Sync initialGears from server updates
  useEffect(() => {
    setGears(initialGears)
  }, [initialGears])

  // React to defaultOpenCreate prop changes (e.g. navigation to /create)
  useEffect(() => {
    if (defaultOpenCreate) {
      setSelectedGear(null)
      setDialogOpen(true)
    }
  }, [defaultOpenCreate])

  // Fetch categories if not pre-rendered
  useEffect(() => {
    if (initialCategories.length === 0) {
      getCategoriesAction().then((res) => {
        if (res.success) {
          setCategories(res.data)
        }
      })
    }
  }, [initialCategories])

  // Handle modal dialog toggle & route syncing
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open && pathname.endsWith("/create")) {
      router.push("/provider-dashboard")
    }
  }

  // Handle instant local state mutation & server cache revalidation
  const handleSuccess = (updatedItem: GearItem, isEditing: boolean) => {
    if (isEditing) {
      setGears((prev) =>
        prev.map((g) => (g.id === updatedItem.id ? { ...g, ...updatedItem } : g))
      )
    } else {
      setGears((prev) => [updatedItem, ...prev])
    }

    router.refresh()

    if (pathname.endsWith("/create")) {
      router.push("/provider-dashboard")
    }
  }

  const handleOpenCreate = () => {
    setSelectedGear(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (gear: GearItem) => {
    setSelectedGear(gear)
    setDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deleteId) return

    startDeleteTransition(async () => {
      const res = await deleteGearAction(deleteId)
      if (res.success) {
        toast.success(res.message)
        setGears((prev) => prev.filter((item) => item.id !== deleteId))
        router.refresh()
      } else {
        toast.error(res.message)
      }
      setDeleteId(null)
    })
  }

  const filteredGears = gears.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategoryFilter === "ALL" || g.categoryId === selectedCategoryFilter

    return matchesSearch && matchesCategory
  })

  const totalStockCount = gears.reduce((acc, curr) => acc + (curr.stock || 0), 0)

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Equipment & Gear Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add gear into admin-created categories, update daily rental rates, and track availability.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl gap-2 shadow-lg shadow-emerald-600/20 px-4 py-2.5"
        >
          <Plus className="size-4" /> Add New Gear
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Listings</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{gears.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Package className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Categories Available</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{categories.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <FolderGit className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Units in Stock</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{totalStockCount}</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Layers className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Pills & Search Input */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter("ALL")}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategoryFilter === "ALL"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedCategoryFilter === cat.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
          <Input
            placeholder="Search gear or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Equipment Inventory Grid */}
      {filteredGears.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
            <Inbox className="size-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No equipment found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Try creating a new listing or clearing your selected category filter.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGears.map((gear) => {
              const effectivePrice = gear.rentPricePerDay - (gear.discountPrice || 0)
              const categoryName = categories.find((c) => c.id === gear.categoryId)?.name
              const hasValidImg = isValidImageUrl(gear.image)

              return (
                <motion.div
                  key={gear.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                    <div>
                      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group flex items-center justify-center">
                        {hasValidImg ? (
                          <Image
                            src={gear.image.trim()}
                            alt={gear.name}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                            <ImageOff className="size-6" />
                            <span className="text-[10px] font-semibold">No Image</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          <Badge className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 border-none">
                            {gear.brand}
                          </Badge>
                          {categoryName && (
                            <Badge className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 border-none">
                              {categoryName}
                            </Badge>
                          )}
                        </div>
                        {gear.discountPrice && gear.discountPrice > 0 ? (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 border-none">
                              BDT {gear.discountPrice} OFF
                            </Badge>
                          </div>
                        ) : null}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {gear.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {gear.description}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80 mt-3">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            Stock: <strong className="text-slate-800 dark:text-slate-200">{gear.stock} units</strong>
                          </span>
                          <div>
                            {gear.discountPrice ? (
                              <span className="text-[10px] text-slate-400 line-through mr-1.5">
                                BDT {gear.rentPricePerDay}
                              </span>
                            ) : null}
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                              BDT {effectivePrice} / day
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/60 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(gear)}
                        className="flex-1 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-800 gap-1.5"
                      >
                        <Edit2 className="size-3.5 text-slate-500" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(gear.id)}
                        className="text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/40 gap-1.5"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Gear Modal Form */}
      <GearFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        categories={categories}
        initialData={selectedGear}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <AlertDialogHeader>
            <div className="size-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-2 border border-red-500/20">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">Delete Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              This will permanently delete this equipment listing from your inventory catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : "Delete Gear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}