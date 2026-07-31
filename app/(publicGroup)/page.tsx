
import { GearListingView } from "@/fearture/gear/components/gear-listing-view"
import { getAllGear } from "@/fearture/gear/_actions/gear.action"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const highlights = [
  { label: "Verified gear", value: "1k+" },
  { label: "Fast pickup", value: "Same day" },
  { label: "Trusted brands", value: "Top rated" },
]

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const query = {
    name: firstValue(resolvedSearchParams.name)?.trim(),
    page: toNumber(firstValue(resolvedSearchParams.page), 1),
    limit: toNumber(firstValue(resolvedSearchParams.limit), 12),
    searchTerm: firstValue(resolvedSearchParams.searchTerm)?.trim(),
    rentPricePerDay: firstValue(resolvedSearchParams.rentPricePerDay)
      ? Number(firstValue(resolvedSearchParams.rentPricePerDay))
      : undefined,
    brand: firstValue(resolvedSearchParams.brand)?.trim(),
  }
  const gearsResult = await getAllGear(query)
  const items = Array.isArray(gearsResult?.data) ? gearsResult.data : []
  const meta = gearsResult?.meta || { page: query.page, limit: query.limit, total: items.length, totalPage: 1 }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_left_top,rgba(14,165,233,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_left_top,rgba(14,165,233,0.08),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <main className="mx-auto grid min-h-screen max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
        <section className="flex flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm backdrop-blur dark:bg-white/5">
            <Logo className="scale-90" />
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Premium equipment rental
            </span>
          </div>

          <div className="max-w-2xl space-y-5 text-left">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Rent smarter
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Rent premium gear,
              <span className="block text-primary">on demand.</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Browse trusted equipment, compare options quickly, and book the gear you need without the usual friction.
              Built for people who want reliable rentals and a clean experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/gear">Explore gear</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link href="#gear-catalog">View catalog</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur dark:bg-white/5"
              >
                <div className="text-2xl font-semibold tracking-tight text-foreground">{item.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-[32px] border border-border/60 bg-background/90 p-5 shadow-2xl shadow-black/5 backdrop-blur dark:bg-slate-950/80">
            <div className="rounded-[24px] bg-linear-to-br from-emerald-500 via-teal-500 to-sky-600 p-6 text-white shadow-lg">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/80">Today&apos;s spotlight</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Professional gear, ready when you are</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">
                Find cameras, tools, and outdoor equipment from verified providers, all presented in a simple catalog.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Browse</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Search by name or brand</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Filter</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Price per day</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Reliable</p>
                <p className="mt-2 text-lg font-semibold text-foreground">A polished catalog built for fast decisions</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <section id="gear-catalog" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <GearListingView initialItems={items} initialMeta={meta} initialQuery={query} />
      </section>
    </div>
  )
}
