import Link from "next/link"
import { Compass, Home, Search } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.1),transparent_26%)]">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Go to GearUp home">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="relative mx-auto mb-8 flex size-32 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />
            <span className="absolute inset-2 rounded-full border border-emerald-500/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur" />
            <div className="relative flex flex-col items-center">
              <span className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                404
              </span>
              <Compass className="size-6 -mt-1 animate-pulse text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Page not found
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              We couldn&apos;t find the route you were looking for.
            </h1>
            <p className="mx-auto max-w-lg text-base text-slate-600 dark:text-slate-400">
              The page may have been moved, renamed, or the link you followed
              could be broken. Let&apos;s get you back to exploring gear on
              GearUp.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-emerald-600 px-6 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <Link href="/">
                <Home className="size-4" />
                Back to home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-slate-200 px-6 dark:border-slate-800"
            >
              <Link href="/gear">
                <Search className="size-4" />
                Browse gear
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Home", href: "/" },
              { label: "Gear catalog", href: "/gear" },
              { label: "Sign in", href: "/login" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur transition hover:border-emerald-500/40 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
              >
                {item.label}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 px-6 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} GearUp. Rent the gear, live the adventure.
      </footer>
    </div>
  )
}