"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Filter, Search, RotateCcw, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GearGridClient } from "./gear-grid-client"
import type { GearItem } from "./gearCard"
import type { GearListQueryParams } from "../_actions/gear.action"

interface GearListingViewProps {
  initialItems: GearItem[]
  initialMeta: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
  initialQuery: GearListQueryParams
}

interface DraftFilters {
  name: string
  searchTerm: string
  rentPricePerDay: string
  brand: string
  page: string
  limit: string
}

const pageCardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
}

function toDraft(query: GearListQueryParams): DraftFilters {
  return {
    name: query.name ?? "",
    searchTerm: query.searchTerm ?? "",
    rentPricePerDay: query.rentPricePerDay ? String(query.rentPricePerDay) : "",
    brand: query.brand ?? "",
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 12),
  }
}

export function GearListingView({ initialItems, initialMeta, initialQuery }: GearListingViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [draft, setDraft] = useState<DraftFilters>(() => toDraft(initialQuery))
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    setItems(initialItems)
    setDraft(toDraft(initialQuery))
  }, [initialItems, initialQuery])

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()

    if (draft.name.trim()) params.set("name", draft.name.trim())
    if (draft.searchTerm.trim()) params.set("searchTerm", draft.searchTerm.trim())
    if (draft.rentPricePerDay.trim()) params.set("rentPricePerDay", draft.rentPricePerDay.trim())
    if (draft.brand.trim()) params.set("brand", draft.brand.trim())
    params.set("page", "1")
    params.set("limit", draft.limit)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const resetFilters = () => {
    router.push(pathname)
  }

  const changePage = (page: number) => {
    const params = new URLSearchParams()

    if (draft.name.trim()) params.set("name", draft.name.trim())
    if (draft.searchTerm.trim()) params.set("searchTerm", draft.searchTerm.trim())
    if (draft.rentPricePerDay.trim()) params.set("rentPricePerDay", draft.rentPricePerDay.trim())
    if (draft.brand.trim()) params.set("brand", draft.brand.trim())
    params.set("page", String(page))
    params.set("limit", draft.limit)

    router.push(`${pathname}?${params.toString()}`)
  }

  const pageButtons = Array.from(
    { length: Math.min(initialMeta.totalPage || 1, 5) },
    (_, index) => index + 1
  )

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <motion.section
        variants={pageCardVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 text-slate-900 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.16),transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Gear catalog
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Search gear by name, brand, status, and price.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                Filter using the exact backend params from your request payload and browse gear results page by page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
            {[
              { label: "Total", value: initialMeta.total },
              { label: "Visible", value: items.length },
              { label: "Page", value: initialMeta.page },
              { label: "Limit", value: initialMeta.limit },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5">
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
          <CardTitle className="text-lg text-slate-900 dark:text-slate-50">Search gear</CardTitle>
          <CardDescription>
            Search by gear name, brand, price, or a general keyword.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={applyFilters} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative md:col-span-2 xl:col-span-4">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                value={draft.searchTerm}
                onChange={(event) => setDraft((prev) => ({ ...prev, searchTerm: event.target.value }))}
                placeholder="Search gear"
                className="h-10 rounded-2xl border-slate-200 bg-white pl-10 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <Input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Name"
              className="h-10 rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            />
            <Input
              value={draft.brand}
              onChange={(event) => setDraft((prev) => ({ ...prev, brand: event.target.value }))}
              placeholder="Brand"
              className="h-10 rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            />
            <Input
              value={draft.rentPricePerDay}
              onChange={(event) => setDraft((prev) => ({ ...prev, rentPricePerDay: event.target.value }))}
              placeholder="Rent price per day"
              type="number"
              className="h-10 rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            />

            <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-4 xl:justify-end">
              <Button type="button" variant="outline" onClick={resetFilters} className="h-11 rounded-full border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button type="submit" disabled={isPending} className="h-11 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
                <Filter className="mr-2 h-4 w-4" /> Apply filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <GearGridClient items={items} />

      <div className="flex flex-col gap-3 border-t border-slate-200/70 px-1 pt-2 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Page {initialMeta.page} of {initialMeta.totalPage || 1} with {initialMeta.limit} results per page.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={(initialMeta.page || 1) <= 1 || isPending} onClick={() => changePage(Math.max(1, (initialMeta.page || 1) - 1))} className="rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            Previous
          </Button>
          {pageButtons.map((pageNumber) => {
            const active = pageNumber === (initialMeta.page || 1)
            return (
              <Button
                key={pageNumber}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => changePage(pageNumber)}
                className={`h-9 min-w-9 rounded-full px-3 ${active ? "border-slate-950 bg-slate-950 text-white hover:bg-slate-900 dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950" : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"}`}
              >
                {pageNumber}
              </Button>
            )
          })}
          <Button type="button" variant="outline" size="sm" disabled={(initialMeta.page || 1) >= (initialMeta.totalPage || 1) || isPending} onClick={() => changePage((initialMeta.page || 1) + 1)} className="rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}