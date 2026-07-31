'use client'

import { useState } from "react"


import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "./logo"
import { useEffect } from "react"
import ProfileDropdown from "./profileComponents"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gear", href: "/gear" },
  { label: "Categories", href: "#categories" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
]

type ProfileDropdownProps = {
  user: {
    name?: string ;
    image?: string ;
    role?: string;
  };
};

function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/admin-dashboard"
  if (role === "PROVIDER") return "/provider-dashboard"
  return "/customer-dashboard"
}

export default function NavbarClient({ user }: ProfileDropdownProps) {
     const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const dashboardHref = getDashboardHref(user?.role)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "mt-3 flex items-center justify-between gap-4 rounded-2xl border px-3 py-2.5 transition-all duration-300 sm:px-4",
            scrolled
              ? "border-border/60 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-xl supports-backdrop-blur:bg-background/90"
              : "border-transparent bg-transparent",
          )}
        >
          {/* Brand */}
          <Link
            href="/"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="GearUp home"
          >
            <Logo />
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                href={dashboardHref}
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Dashboard
              </Link>
            ) : null}
          </nav>

          
          <div className="hidden items-center gap-2 md:flex">
  <ModeToggle />

        {user ? (
          <ProfileDropdown user={user} />
        ) : (
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}

        <Button size="lg" asChild>
          <Link href="#">
            List your gear
          </Link>
        </Button>
      </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ModeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 top-20 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl"
            >
              <nav className="flex flex-col" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Dashboard
                  </Link>
                ) : null}
              </nav>
              <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
                <Button asChild>
              <Link href="/login">
                Sign in
              </Link>
            </Button>
                <Button size="lg" asChild>
              <Link href="#">
                List your gear
              </Link>
            </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}