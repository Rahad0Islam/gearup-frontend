"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Search, Trash2, PencilLine, FolderOpen, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deleteCategoryAction, type AdminCategory } from "@/fearture/admin/actions/category.action"
import { CategoryFormDialog } from "./category-form-dialog"

interface CategoryManagementViewProps {
  initialCategories: AdminCategory[]
  initialCreateOpen?: boolean
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 16 },
  },
}

export function CategoryManagementView({ initialCategories, initialCreateOpen = false }: CategoryManagementViewProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [createOpen, setCreateOpen] = useState(initialCreateOpen)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null)

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return categories
    return categories.filter((category) =>
      [category.name, category.description ?? ""].some((value) => value.toLowerCase().includes(query))
    )
  }, [categories, searchTerm])

  const totalCount = categories.length

  const handleDelete = async () => {
    if (!deletingCategory) return

    const result = await deleteCategoryAction(deletingCategory.id)
    if (result.success) {
      toast.success(result.message)
      setCategories((prev) => prev.filter((category) => category.id !== deletingCategory.id))
      setDeletingCategory(null)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 text-slate-900 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.16),transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Admin categories
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Manage categories for all gear listings.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                Create, edit, and remove categories. Providers will use these categories when adding gear.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
            {[
              { label: "Total", value: totalCount },
              { label: "Visible", value: filteredCategories.length },
              { label: "Active", value: filteredCategories.length },
              { label: "Tools", value: 3 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-slate-900 dark:text-slate-50">Category directory</CardTitle>
              <CardDescription>Search by category name or description and manage each row directly.</CardDescription>
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search categories..."
              className="h-11 rounded-2xl border-slate-200 bg-white pl-10 dark:border-slate-800 dark:bg-slate-950"
            />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800">
            <div className="grid grid-cols-12 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
              <div className="col-span-4">Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <AnimatePresence>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-12 items-center gap-3 border-t border-slate-200/70 bg-white px-5 py-4 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/50"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-50">{category.name}</div>
                        <Badge variant="outline" className="mt-1 border-slate-200 bg-slate-50 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>

                    <div className="col-span-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {category.description || "No description provided."}
                    </div>

                    <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400">
                      {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "-"}
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setEditingCategory(category)}
                        className="h-9 w-9 rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setDeletingCategory(category)}
                        className="h-9 w-9 rounded-full border-slate-200 bg-white text-rose-600 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="rounded-full bg-slate-100 p-4 text-slate-400 dark:bg-slate-900">
                    <FolderOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">No categories found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Try another search or create a new category.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={(category, isEditing) => {
          setCategories((prev) => {
            if (isEditing) {
              return prev.map((item) => (item.id === category.id ? category : item))
            }

            return [category, ...prev]
          })
        }}
      />

      <CategoryFormDialog
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null)
        }}
        initialCategory={editingCategory}
        onSuccess={(category, isEditing) => {
          setCategories((prev) => {
            if (isEditing) {
              return prev.map((item) => (item.id === category.id ? category : item))
            }

            return [category, ...prev]
          })
          setEditingCategory(null)
        }}
      />

      <AlertDialog open={Boolean(deletingCategory)} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the category from the admin list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 text-white hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}