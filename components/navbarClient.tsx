'use client'

import { useState } from "react"


import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  User,
  LogOut,
  Compass,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "./logo"
import { useEffect } from "react"
import logout from "@/app/(authGroup)/_actions/logOut"
import ProfileDropdown, { ProfileDropdownHandle } from "./profileComponents"
import { MobileSidebarTrigger } from "@/fearture/customer/components/customer-sidebar"

type NavbarCategory = {
  id: string
  name: string
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gear", href: "/gear" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
]

type ProfileDropdownProps = {
  user: {
    name?: string ;
    image?: string ;
    role?: string;
  };
  categories?: NavbarCategory[];
  leftSlot?: React.ReactNode;
};

function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/admin-dashboard"
  if (role === "PROVIDER") return "/provider-dashboard"
  return "/customer-dashboard"
}

export default function NavbarClient({ user, categories = [], leftSlot }: ProfileDropdownProps) {
     const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileView, setMobileView] = useState<"main" | "profile" | "categories">("main")
  const [desktopLoggingOut, setDesktopLoggingOut] = useState(false)
  const dashboardHref = getDashboardHref(user?.role)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const dropdownRef = React.useRef<ProfileDropdownHandle>(null)

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

  // Reset to main view whenever the panel closes
  useEffect(() => {
    if (!open) setMobileView("main")
  }, [open])

  const closeMobile = () => {
    setOpen(false)
  }

  const pathname = usePathname()
  const dashRole: "CUSTOMER" | "PROVIDER" | "ADMIN" | null = (() => {
    if (!pathname) return null
    if (pathname.startsWith("/admin-dashboard")) return "ADMIN"
    if (pathname.startsWith("/provider-dashboard")) return "PROVIDER"
    if (pathname.startsWith("/customer-dashboard")) return "CUSTOMER"
    return null
  })()

  const handleMobileLogout = () => {
    startTransition(async () => {
      try {
        await logout()
        toast.success("Logout successfully")
        router.refresh()
        router.push("/")
      } catch (error) {
        console.error("Logout failed:", error)
        toast.error("Logout failed")
      } finally {
        setOpen(false)
        setMobileView("main")
      }
    })
  }

  const handleDesktopLogout = () => {
    // Close the dropdown first so the menu disappears before the overlay fades in.
    // Wrapping in requestAnimationFrame avoids React batching the close with the
    // overlay mount, which used to leave the menu briefly visible on top of the
    // overlay during navigation.
    requestAnimationFrame(() => {
      dropdownRef.current?.closeMenu()
      setDesktopLoggingOut(true)
    })
    startTransition(async () => {
      try {
        await logout()
        toast.success("Logout successfully")
        // Refresh server data, then push to home. Keep the overlay visible
        // through both — the `pathname` effect below dismisses it once the
        // home page is the active route, so the user never sees the old
        // dashboard flicker back in.
        router.refresh()
        router.push("/")
      } catch (error) {
        console.error("Logout failed:", error)
        toast.error("Logout failed")
        setDesktopLoggingOut(false)
      }
    })
  }

  // Dismiss the logout overlay only once the navigation has actually landed on
  // the home route. This keeps the spinner up through any RSC refresh + push
  // so the previous authenticated page never flashes behind it.
  useEffect(() => {
    if (desktopLoggingOut && pathname === "/") {
      setDesktopLoggingOut(false)
    }
  }, [desktopLoggingOut, pathname])

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
          <div className="flex items-center gap-2">
            {leftSlot}
            {dashRole ? (
              <div className="lg:hidden">
                <MobileSidebarTrigger role={dashRole} />
              </div>
            ) : null}
            <Link
              href="/"
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="GearUp home"
            >
              <Logo />
            </Link>
          </div>

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Categories
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Browse categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/gear">All gear</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/gear/category/${category.id}`}>{category.name}</Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No categories found</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          
          <div className="hidden items-center gap-2 md:flex">
  <ModeToggle />

        {user ? (
          <ProfileDropdown
            ref={dropdownRef}
            user={user}
            onLogout={handleDesktopLogout}
            disabled={desktopLoggingOut}
          />
        ) : (
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
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
              onClick={closeMobile}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 top-20 max-h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileView === "main" && (
                  <motion.nav
                    key="main"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-1 overflow-y-auto"
                    aria-label="Mobile"
                  >
                    {/* Profile entry (signed-in only) */}
                    {user ? (
                      <button
                        type="button"
                        onClick={() => setMobileView("profile")}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-3 text-left transition-colors hover:bg-accent"
                      >
                        <Avatar className="size-9">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || "User"}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate text-sm font-semibold text-foreground">
                          {user.name || "User"}
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </button>
                    ) : (
                      <Button asChild className="rounded-xl">
                        <Link href="/login" onClick={closeMobile}>
                          Sign in
                        </Link>
                      </Button>
                    )}

                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobile}
                        className="rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}

                    {user ? (
                      <Link
                        href={dashboardHref}
                        onClick={closeMobile}
                        className="rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Dashboard
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setMobileView("categories")}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-3 text-left transition-colors hover:bg-accent"
                    >
                      <span className="text-base font-medium text-foreground/90">
                        Categories
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>

                    <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
                      {user ? (
                        <button
                          type="button"
                          onClick={handleMobileLogout}
                          disabled={isPending}
                          className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-3 text-base font-semibold text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                        >
                          <LogOut className="size-4" />
                          {isPending ? "Logging out..." : "Logout"}
                        </button>
                      ) : null}
                    </div>
                  </motion.nav>
                )}

                {mobileView === "profile" && user ? (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-1 overflow-y-auto"
                    aria-label="Mobile profile"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileView("main")}
                      className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ChevronDown className="size-4 rotate-90" />
                      Back
                    </button>

                    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.name || "User"}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-foreground">
                          {user.name || "User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.role
                            ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
                            : "Member"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <User className="size-4 text-muted-foreground" />
                      Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleMobileLogout}
                      disabled={isPending}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      {isPending ? "Logging out..." : "Logout"}
                    </button>
                  </motion.div>
                ) : null}

                {mobileView === "categories" ? (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-1 overflow-y-auto"
                    aria-label="Mobile categories"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileView("main")}
                      className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ChevronDown className="size-4 rotate-90" />
                      Back
                    </button>

                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Browse categories
                    </p>

                    <Link
                      href="/gear"
                      onClick={closeMobile}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      All gear
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>

                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/gear/category/${category.id}`}
                          onClick={closeMobile}
                          className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {category.name}
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      ))
                    ) : (
                      <p className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-muted-foreground">
                        <Compass className="size-4" />
                        No categories found
                      </p>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop logout: full-page loading overlay */}
      <AnimatePresence>
        {desktopLoggingOut ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-label="Logging out"
          >
            <div className="relative size-16">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
              <span className="absolute inset-2 animate-pulse rounded-full bg-emerald-500/40" />
              <span className="absolute inset-4 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <span className="size-3 animate-pulse rounded-full bg-white" />
              </span>
            </div>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.32em] text-emerald-600/80 dark:text-emerald-400/80">
              Logging out
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}