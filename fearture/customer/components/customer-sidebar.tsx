"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SIDEBAR_ITEMS } from "@/fearture/dashboard/data/sidebar-config"

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN"

interface NavItem {
  title: string
  route: string
  icon: React.ElementType
  description: string
}

const ROLE_HEADER_INFO: Record<Role, { title: string; description: string }> = {
  ADMIN: {
    title: "Admin Dashboard",
    description: "System administration & overview",
  },
  PROVIDER: {
    title: "Provider Dashboard",
    description: "Manage your listings & rentals",
  },
  CUSTOMER: {
    title: "Customer Dashboard",
    description: "Manage your rentals & account details",
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
}

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

interface SidebarContentProps {
  onClose?: () => void
  navigationItems: NavItem[]
  role: Role
}

function SidebarContent({ onClose, navigationItems, role }: SidebarContentProps) {
  const pathname = usePathname()
  const headerInfo = ROLE_HEADER_INFO[role] || ROLE_HEADER_INFO.CUSTOMER

  // Base overview routes that require exact matching
  const baseOverviewRoutes = [
    "/customer-dashboard",
    "/provider-dashboard",
    "/admin-dashboard",
  ]

  // 1. Determine exactly ONE active item from the list
  const activeNavItem =
    // First, check for an exact pathname match
    navigationItems.find((item) => item.route === pathname) ||
    // Second, check for sub-route matches (excluding base overview paths)
    navigationItems.find(
      (item) =>
        !baseOverviewRoutes.includes(item.route) &&
        item.route !== "" &&
        pathname.startsWith(`${item.route}/`)
    )

  const activeRoute = activeNavItem?.route

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex h-full flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"
    >
      {/* Dynamic Role Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="px-6 py-6"
      >
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
          {headerInfo.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          {headerInfo.description}
        </p>
      </motion.div>

      <Separator className="dark:bg-slate-800" />

      {/* Navigation Items */}
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon
          // Strict single-item equality check
          const isActive = activeRoute === item.route

          return (
            <motion.div key={item.route} variants={itemVariants}>
              <Link href={item.route}>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <motion.div
                    className="mt-0.5 flex-shrink-0"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                </motion.button>
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>

      {/* Footer Spacing */}
      <div className="px-4 py-4">
        <Separator className="dark:bg-slate-800" />
      </div>
    </motion.div>
  )
}

interface Props {
  role: Role
}

export function CustomerSidebar({ role }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const navigationItems = SIDEBAR_ITEMS[role] || []

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-0 z-30 p-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 border-slate-200 dark:border-slate-800"
          >
            <SidebarContent
              onClose={() => setIsOpen(false)}
              navigationItems={navigationItems}
              role={role}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key="sidebar"
            className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 z-30"
          >
            <SidebarContent navigationItems={navigationItems} role={role} />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}