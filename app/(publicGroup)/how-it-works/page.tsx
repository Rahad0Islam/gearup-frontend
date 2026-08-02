import Link from "next/link"
import { Search, CalendarCheck, PackageCheck, ShieldCheck, CreditCard, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import getCurrentUser from "@/app/(authGroup)/_actions/getCurrentUser"

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Browse the catalog",
    description:
      "Search and filter gear by category, brand, or daily price. Every item shows real-time availability, stock, and verified reviews from past renters.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book your dates",
    description:
      "Pick a pickup and return date, add items to your rental cart, and pay securely with Stripe. Providers confirm your order instantly.",
  },
  {
    icon: PackageCheck,
    step: "03",
    title: "Pick up & return",
    description:
      "Collect your gear on the chosen date, use it for the rental period, then drop it back. Late returns are auto-calculated as a small late fee.",
  },
]

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Verified providers",
    description: "Every provider is reviewed by GearUp admins before they can list gear.",
  },
  {
    icon: CreditCard,
    title: "Secure checkout",
    description: "Stripe handles payments — your card details never touch our servers.",
  },
  {
    icon: Star,
    title: "Honest reviews",
    description: "Only customers who actually rented can leave a rating and comment.",
  },
]

export default async function HowItWorksPage() {
  const userResult = await getCurrentUser()
  const user = userResult?.data || null

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_left_top,rgba(14,165,233,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_left_top,rgba(14,165,233,0.08),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm backdrop-blur dark:bg-white/5">
            <Logo className="scale-90" />
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              How it works
            </span>
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            From discovery to return —
            <span className="block text-primary">in three simple steps.</span>
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            GearUp keeps the rental flow tight: discover what you need, lock in your dates with secure
            checkout, and pick up the gear from a verified provider near you.
          </p>
        </section>

        {/* Steps */}
        <section className="mt-16" aria-label="Rental steps">
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, step, title, description }) => (
              <li
                key={step}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 dark:bg-card/40"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Step {step}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Highlights */}
        <section className="mt-20" aria-label="Why GearUp">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
              Why GearUp
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for trust, speed, and a great rental experience
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur dark:bg-card/40"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/60 p-10 text-center shadow-sm backdrop-blur dark:bg-card/40">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ready to find your next piece of gear?
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Sign in to track your rentals, or jump straight into the catalog to see what&apos;s available today.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/gear">Browse gear</Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link href="/register">Create an account</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="lg" className="rounded-full px-6">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
