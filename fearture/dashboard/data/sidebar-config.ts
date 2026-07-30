import {
  LayoutDashboard,
  PackageCheck,
  CreditCard,
  Star,
  Users,
  ShieldAlert,
} from "lucide-react"

export const SIDEBAR_ITEMS = {
  CUSTOMER: [
    {
      title: "Overview",
      route: "/customer-dashboard",
      icon: LayoutDashboard,
      description: "Customer dashboard overview",
    },
    {
      title: "My Rentals",
      route: "/customer-dashboard/rental",
      icon: PackageCheck,
      description: "Track rental orders and status",
    },
    {
      title: "Payments",
      route: "/customer-dashboard/rental/payment-history",
      icon: CreditCard,
      description: "View payment history",
    },
    {
      title: "Reviews",
      route: "/customer-dashboard/reviews",
      icon: Star,
      description: "Manage your reviews",
    },
  ],
  PROVIDER: [
    {
      title: "Overview",
      route: "/provider-dashboard",
      icon: LayoutDashboard,
      description: "Provider dashboard overview",
    },
    {
      title: "Rentals Management",
      route: "/provider-dashboard/rentals",
      icon: PackageCheck,
      description: "Manage item listings and orders",
    },
    {
      title: "create Gear",
      route: "/provider-dashboard/gear/create",
      icon: Star,
      description: "Create and manage your gear listings",
    },
  ],
  ADMIN: [
    {
      title: "Overview",
      route: "/admin-dashboard",
      icon: LayoutDashboard,
      description: "System administration",
    },
    {
      title: "Users",
      route: "/admin-dashboard/users",
      icon: Users,
      description: "Manage accounts and permissions",
    },
    {
      title: "System Logs",
      route: "/admin-dashboard/logs",
      icon: ShieldAlert,
      description: "Security and system audit logs",
    },
  ],
}