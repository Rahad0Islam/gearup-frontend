"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Filter, RotateCcw, Search, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  AdminUser,
  AdminUserStatus,
  AdminUsersMeta,
  AdminUsersQueryParams,
} from "@/fearture/admin/actions/admin.action"
import { updateUserStatusAction } from "@/fearture/admin/actions/admin.action"
import { AdminOverviewCards } from "./admin-overview-cards"
import { AdminUsersTable } from "./admin-users-table"

interface AdminDashboardViewProps {
  initialUsers: AdminUser[]
  initialMeta: AdminUsersMeta
  initialQuery: AdminUsersQueryParams
}

interface DraftFilters {
  id: string
  name: string
  email: string
  limit: string
  page: string
}

function metaFromQuery(meta: AdminUsersMeta, users: AdminUser[], query: AdminUsersQueryParams) {
  const limit = query.limit ?? meta.limit ?? 10
  const total = meta.total ?? users.length
  const totalPage = Math.max(1, Math.ceil(total / limit))

  return {
    page: query.page || meta.page || 1,
    limit,
    total,
    totalPage,
  }
}

function queryToDraft(query: AdminUsersQueryParams): DraftFilters {
  return {
    id: query.id ?? "",
    name: query.name ?? "",
    email: query.email ?? "",
    limit: String(query.limit ?? 10),
    page: String(query.page ?? 1),
  }
}

function buildParams(draft: DraftFilters) {
  const params = new URLSearchParams()

  if (draft.id.trim()) params.set("id", draft.id.trim())
  if (draft.name.trim()) params.set("name", draft.name.trim())
  if (draft.email.trim()) params.set("email", draft.email.trim())
  params.set("limit", draft.limit)
  params.set("page", draft.page)

  return params
}

const headerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
}

export function AdminDashboardView({
  initialUsers,
  initialMeta,
  initialQuery,
}: AdminDashboardViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [users, setUsers] = useState(initialUsers)
  const [meta, setMeta] = useState(() => metaFromQuery(initialMeta, initialUsers, initialQuery))
  const [draft, setDraft] = useState<DraftFilters>(() => queryToDraft(initialQuery))
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setUsers(initialUsers)
    setMeta(metaFromQuery(initialMeta, initialUsers, initialQuery))
    setDraft(queryToDraft(initialQuery))
  }, [initialUsers, initialMeta, initialQuery])

  const customerCount = users.filter((user) => user.role === "CUSTOMER").length
  const providerCount = users.filter((user) => user.role === "PROVIDER").length
  const suspendedCount = users.filter((user) => user.activeStatus === "SUSPENDED").length
  const activeCount = users.filter((user) => user.activeStatus === "ACTIVE").length

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = buildParams({ ...draft, page: "1" })
    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    router.push(pathname)
  }

  const handlePageChange = (page: number) => {
    const params = buildParams({ ...draft, page: String(page) })
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleStatusChange = async (userId: string, nextStatus: AdminUserStatus) => {
    const previousUser = users.find((user) => user.id === userId)
    if (!previousUser || previousUser.activeStatus === nextStatus) return

    setPendingUserId(userId)
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, activeStatus: nextStatus } : user
      )
    )

    const result = await updateUserStatusAction(userId, nextStatus)

    if (result.success) {
      toast.success(result.message || "User status updated")
      router.refresh()
    } else {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, activeStatus: previousUser.activeStatus } : user
        )
      )
      toast.error(result.message || "Failed to update user status")
    }

    setPendingUserId(null)
  }

  const pageLabel = `${meta.page}/${meta.totalPage}`

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <motion.section
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 text-slate-900 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.16),transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Admin control center
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                User access, status, and role overview in one place.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                Search by name, email, or user id, move through pages, and switch account state without leaving the dashboard.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
            {[
              { label: "Total", value: meta.total },
              { label: "Customers", value: customerCount },
              { label: "Providers", value: providerCount },
              { label: "Active", value: activeCount },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <AdminOverviewCards
        totalUsers={meta.total}
        customerCount={customerCount}
        providerCount={providerCount}
        suspendedCount={suspendedCount}
      />

      <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
          <CardTitle className="text-lg text-slate-900 dark:text-slate-50">
            Advanced search
          </CardTitle>
          <CardDescription>
            Query params stay in sync with the backend, so list changes are always server-backed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={applyFilters} className="grid gap-4 lg:grid-cols-12">
            <div className="relative lg:col-span-4">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Search users by name"
                className="h-11 rounded-2xl border-slate-200 bg-white pl-10 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            <Input
              value={draft.email}
              onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Search users by email"
              className="h-11 rounded-2xl border-slate-200 bg-white lg:col-span-2 dark:border-slate-800 dark:bg-slate-950"
            />

            <Input
              value={draft.id}
              onChange={(event) => setDraft((prev) => ({ ...prev, id: event.target.value }))}
              placeholder="User ID"
              className="h-11 rounded-2xl border-slate-200 bg-white lg:col-span-3 dark:border-slate-800 dark:bg-slate-950"
            />

            <Select
              value={draft.limit}
              onValueChange={(value) => setDraft((prev) => ({ ...prev, limit: value }))}
            >
              <SelectTrigger className="h-11 w-36 rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((limitValue) => (
                  <SelectItem key={limitValue} value={String(limitValue)}>
                    {limitValue} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-3 lg:col-span-12 lg:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-11 rounded-full border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                <Filter className="mr-2 h-4 w-4" />
                Apply filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <span className="font-medium text-slate-900 dark:text-slate-50">Current page:</span> {pageLabel}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <span className="font-medium text-slate-900 dark:text-slate-50">Visible rows:</span> {users.length}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
          <span className="font-medium text-slate-900 dark:text-slate-50">Suspended:</span> {suspendedCount}
        </div>
      </div>

      <AdminUsersTable
        users={users}
        currentPage={meta.page}
        totalPage={meta.totalPage}
        totalUsers={meta.total}
        limit={meta.limit}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}
        pendingUserId={pendingUserId}
      />
    </div>
  )
}