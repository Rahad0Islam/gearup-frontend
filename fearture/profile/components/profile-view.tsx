"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
  Mail,
  ShieldCheck,
  User as UserIcon,
  BadgeCheck,
  CalendarClock,
  AtSign,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { ProfileData } from "../actions/profile.action"

interface ProfileViewProps {
  initialUser: ProfileData
}

function isValidImageUrl(url?: string | null): url is string {
  if (!url || typeof url !== "string") return false
  const trimmed = url.trim()
  if (!trimmed) return false
  if (trimmed.startsWith("/")) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

const ROLE_LABEL: Record<ProfileData["role"], string> = {
  CUSTOMER: "Customer",
  PROVIDER: "Provider",
  ADMIN: "Administrator",
}

function formatDate(value?: string): string {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  hint?: string
}

function InfoRow({ icon: Icon, label, value, hint }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 px-4 py-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-50 break-words">
          {value}
        </p>
        {hint ? (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        ) : null}
      </div>
    </div>
  )
}

export function ProfileView({ initialUser }: ProfileViewProps) {
  const hasImage = isValidImageUrl(initialUser.image)
  const initials = (initialUser.name || initialUser.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-1"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 font-semibold">
          Account
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          My Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Account details fetched from the server. Contact support to update your information.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="md:col-span-1"
        >
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <Avatar className="h-28 w-28 ring-2 ring-emerald-500/30 shadow-md">
                {hasImage ? (
                  <AvatarImage
                    src={initialUser.image as string}
                    alt={initialUser.name || "User"}
                  />
                ) : null}
                <AvatarFallback className="text-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {initialUser.name || "Unnamed user"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                  {initialUser.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {ROLE_LABEL[initialUser.role] ?? initialUser.role}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    initialUser.activeStatus === "ACTIVE"
                      ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                      : "border-amber-500/40 text-amber-700 dark:text-amber-300"
                  }
                >
                  <BadgeCheck className="mr-1 h-3 w-3" />
                  {initialUser.activeStatus || "UNKNOWN"}
                </Badge>
              </div>

              <Separator className="dark:bg-slate-800" />

              <div className="w-full text-left space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Account ID
                </p>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">
                  {initialUser.id}
                </p>
              </div>

              {hasImage ? (
                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                  <Image
                    src={initialUser.image as string}
                    alt="Profile photo preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {/* Detail rows */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="pt-6 space-y-4">
              <InfoRow
                icon={UserIcon}
                label="Display name"
                value={initialUser.name || "—"}
              />

              <InfoRow
                icon={Mail}
                label="Email address"
                value={initialUser.email}
                hint="Email changes are not supported from the dashboard."
              />

              <InfoRow
                icon={AtSign}
                label="Role"
                value={ROLE_LABEL[initialUser.role] ?? initialUser.role}
              />

              <InfoRow
                icon={BadgeCheck}
                label="Account status"
                value={initialUser.activeStatus || "UNKNOWN"}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow
                  icon={CalendarClock}
                  label="Joined"
                  value={formatDate(initialUser.createdAt)}
                />
                <InfoRow
                  icon={CalendarClock}
                  label="Last updated"
                  value={formatDate(initialUser.updatedAt)}
                />
              </div>
            </CardContent>
          </Card>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Read-only view. Profile updates are handled by the platform team.
          </p>
        </motion.div>
      </div>
    </div>
  )
}