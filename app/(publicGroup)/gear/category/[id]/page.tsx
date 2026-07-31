import Link from "next/link"

import { Button } from "@/components/ui/button"
import { GearGridClient } from "@/fearture/gear/components/gear-grid-client"
import { getGearByCategoryId } from "@/fearture/gear/_actions/gear.action"
import { getCategoriesAction } from "@/fearture/provider/actions/gear.action"

export default async function CategoryGearPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [categoryResult, gearResult] = await Promise.all([
    getCategoriesAction(),
    getGearByCategoryId(id),
  ])

  const category = categoryResult?.data?.find((item) => item.id === id)
  const items = Array.isArray(gearResult?.data) ? gearResult.data : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2 text-left">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Category</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {category?.name || "Category gear"}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Browse all gear available in this category.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href="/gear">Back to all gear</Link>
        </Button>
      </div>

      <GearGridClient items={items} />
    </div>
  )
}