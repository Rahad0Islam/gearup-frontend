import Link from "next/link"
import { Compass, Globe, Mail, MapPin } from "lucide-react"

import { Logo } from "@/components/logo"
import { Separator } from "@/components/ui/separator"

const PRODUCT_LINKS = [
  { label: "Browse gear", href: "/gear" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Sign in", href: "/login" },
  { label: "Create account", href: "/register" },
]

const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "mailto:hello@gearup.local" },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative mt-16 border-t border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur"
      aria-labelledby="site-footer-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <h2 id="site-footer-heading" className="sr-only">
        Site footer
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Link href="/" aria-label="GearUp home" className="inline-flex">
              <Logo />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              GearUp is a peer-to-peer rental marketplace for outdoor and
              adventure gear. Rent what you need, lend what you don&apos;t —
              built for explorers on a budget.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:hello@gearup.local"
                aria-label="Email GearUp"
                className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="https://github.com/Rahad0Islam"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GearUp on GitHub"
                className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Globe className="size-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Product
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-600 dark:text-slate-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>
                  Remote-first · serving customers across Bangladesh and beyond.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <a
                  href="mailto:hello@gearup.local"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  hello@gearup.local
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Compass className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>Rent the gear. Live the adventure.</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 dark:bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <p>
            © {year} GearUp. All rights reserved.
            <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
            <span>
              Crafted by{" "}
              <Link
                href="/about"
                className="font-medium text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
              >
                Rahad Islam
              </Link>
            </span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={COMPANY_LINKS[0].href}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {COMPANY_LINKS[0].label}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href={COMPANY_LINKS[1].href}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {COMPANY_LINKS[1].label}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}