import { getAllUsersAction, type AdminUsersQueryParams } from "@/fearture/admin/actions/admin.action"
import { AdminDashboardView } from "@/fearture/admin/components/admin-dashboard-view"

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const limit = toNumber(firstValue(resolvedSearchParams.limit), 10)
  const page = toNumber(firstValue(resolvedSearchParams.page), 1)

  const query: AdminUsersQueryParams = {
    id: firstValue(resolvedSearchParams.id)?.trim(),
    name: firstValue(resolvedSearchParams.name)?.trim(),
    email: firstValue(resolvedSearchParams.email)?.trim(),
    searchTerm: firstValue(resolvedSearchParams.searchTerm)?.trim(),
    limit,
    page,
  }

  const usersResult = await getAllUsersAction(query)
  const initialUsers = usersResult.success ? usersResult.data : []

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <AdminDashboardView
        initialUsers={initialUsers}
        initialMeta={usersResult.meta}
        initialQuery={query}
      />
    </div>
  )
}