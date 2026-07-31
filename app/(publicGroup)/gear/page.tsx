import { GearGrid } from "@/fearture/gear/components/gearGrid"
import { GearListingView } from "@/fearture/gear/components/gear-listing-view"

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export default async function GearPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const query = {
    name: firstValue(resolvedSearchParams.name)?.trim(),
    description: firstValue(resolvedSearchParams.description)?.trim(),
    page: toNumber(firstValue(resolvedSearchParams.page), 1),
    limit: toNumber(firstValue(resolvedSearchParams.limit), 12),
    searchTerm: firstValue(resolvedSearchParams.searchTerm)?.trim(),
    rentPricePerDay: firstValue(resolvedSearchParams.rentPricePerDay)
      ? Number(firstValue(resolvedSearchParams.rentPricePerDay))
      : undefined,
    sortBy: firstValue(resolvedSearchParams.sortBy)?.trim() || "createdAt",
    sortOrder: firstValue(resolvedSearchParams.sortOrder) === "asc" ? "asc" : "desc",
    brand: firstValue(resolvedSearchParams.brand)?.trim(),
    status: firstValue(resolvedSearchParams.status)?.trim(),
  }

  const gearsResult = await import("@/fearture/gear/_actions/gear.action").then((mod) =>
    mod.getAllGear(query)
  )

  const items = Array.isArray(gearsResult?.data) ? gearsResult.data : []
  const meta = gearsResult?.meta || { page: query.page, limit: query.limit, total: items.length, totalPage: 1 }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <GearListingView initialItems={items} initialMeta={meta} initialQuery={query} />
    </div>
  )
}