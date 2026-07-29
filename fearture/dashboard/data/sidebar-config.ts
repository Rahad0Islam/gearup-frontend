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
      route: "/dashboard/provider",
      icon: LayoutDashboard,
      description: "Provider dashboard overview",
    },
    {
      title: "Rentals Management",
      route: "/dashboard/provider/rentals",
      icon: PackageCheck,
      description: "Manage item listings and orders",
    },
  ],
  ADMIN: [
    {
      title: "Overview",
      route: "/dashboard/admin",
      icon: LayoutDashboard,
      description: "System administration",
    },
    {
      title: "Users",
      route: "/dashboard/admin/users",
      icon: Users,
      description: "Manage accounts and permissions",
    },
    {
      title: "System Logs",
      route: "/dashboard/admin/logs",
      icon: ShieldAlert,
      description: "Security and system audit logs",
    },
  ],
}