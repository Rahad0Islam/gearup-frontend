"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { AdminUser, AdminUserStatus } from "@/fearture/admin/actions/admin.action"

interface AdminUsersTableProps {
  users: AdminUser[]
  currentPage: number
  totalPage: number
  totalUsers: number
  limit: number
  onStatusChange: (userId: string, status: AdminUserStatus) => Promise<void>
  onPageChange: (page: number) => void
  pendingUserId: string | null
}

const tableRowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 16,
    },
  },
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function statusClassName(status: string) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    case "SUSPENDED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300"
  }
}

function getVisiblePages(currentPage: number, totalPage: number) {
  if (totalPage <= 5) {
    return Array.from({ length: totalPage }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPage])

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPage) pages.add(page)
  }

  return Array.from(pages).sort((left, right) => left - right)
}

export function AdminUsersTable({
  users,
  currentPage,
  totalPage,
  totalUsers,
  limit,
  onStatusChange,
  onPageChange,
  pendingUserId,
}: AdminUsersTableProps) {
  return (
    <Card className="overflow-hidden border-slate-200/70 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <CardHeader className="border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-50">
              User directory
            </CardTitle>
            <CardDescription>
              Review accounts, switch active status, and keep customer/provider access in sync.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="w-fit border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {totalUsers} total records
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 dark:bg-slate-900/60">
              <TableHead className="pl-5">User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="pr-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {users.length > 0 ? (
                users.map((user, index) => {
                  const isPending = pendingUserId === user.id
                  const canUpdate = user.role !== "ADMIN"

                  return (
                    <motion.tr
                      key={user.id}
                      layout
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -10 }}
                      custom={index}
                      className="border-b border-slate-200/70 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/50"
                    >
                      <TableCell className="pl-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-900 dark:text-slate-50">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            #{user.id.slice(0, 8)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600 dark:text-slate-300">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-semibold",
                            user.role === "ADMIN"
                              ? "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                              : user.role === "PROVIDER"
                                ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          )}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-semibold", statusClassName(user.activeStatus))}>
                          {user.activeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600 dark:text-slate-300">
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <div className="ml-auto flex w-full items-center justify-end gap-3">
                          {isPending ? (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Updating
                            </div>
                          ) : null}
                          <Select
                            value={user.activeStatus}
                            onValueChange={(value) => onStatusChange(user.id, value as AdminUserStatus)}
                            disabled={isPending || !canUpdate}
                          >
                            <SelectTrigger className="h-9 w-37.5 rounded-full border-slate-200 bg-white text-xs dark:border-slate-800 dark:bg-slate-950">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                            </SelectContent>
                          </Select>
                          {!canUpdate ? (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                              <MoreHorizontal className="h-4 w-4" />
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    </motion.tr>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <UsersPlaceholderIcon />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                          No users found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Adjust the filters or pagination to load another slice of the directory.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4 border-t border-slate-200/70 px-5 py-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing page {currentPage} of {totalPage || 1} with {limit} rows per page.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <div className="flex items-center gap-2">
              {getVisiblePages(currentPage, totalPage || 1).map((pageNumber) => {
                const isActive = pageNumber === currentPage

                return (
                  <Button
                    key={pageNumber}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className={cn(
                      "h-9 min-w-9 rounded-full px-3",
                      isActive
                        ? "border-slate-950 bg-slate-950 text-white hover:bg-slate-900 dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    )}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPage || 1, currentPage + 1))}
              disabled={currentPage >= (totalPage || 1)}
              className="rounded-full border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UsersPlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.5A4.5 4.5 0 0 0 4 19.5V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10.5" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 21v-1.2a3.8 3.8 0 0 0-3-3.72"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.2 4.7a3.1 3.1 0 0 1 0 6.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}