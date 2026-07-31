"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.BACKEND_URL

export type AdminUserRole = "CUSTOMER" | "PROVIDER" | "ADMIN"
export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | string

export interface AdminUser {
	id: string
	name: string
	email: string
	activeStatus: AdminUserStatus
	role: AdminUserRole
	createdAt: string
	updatedAt: string
}

export interface AdminUsersMeta {
	page: number
	limit: number
	total: number
	totalPage: number
}

export interface AdminUsersQueryParams {
	id?: string
	name?: string
	email?: string
	searchTerm?: string
	limit?: number
	page?: number
	sortBy?: string
	sortOrder?: "asc" | "desc"
}

export interface AdminUsersResponse {
	success: boolean
	statuscode?: number
	message?: string
	data: AdminUser[]
	meta: AdminUsersMeta
}

async function getAuthHeader() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get("accessToken")?.value

	return {
		"Content-Type": "application/json",
		Cookie: `accessToken=${accessToken}`,
	}
}

function buildQueryString(params: AdminUsersQueryParams) {
	const query = new URLSearchParams()

	if (params.id) query.set("id", params.id)
	if (params.name) query.set("name", params.name)
	if (params.email) query.set("email", params.email)
	if (params.searchTerm) query.set("searchTerm", params.searchTerm)
	if (typeof params.limit === "number") query.set("limit", String(params.limit))
	if (typeof params.page === "number") query.set("page", String(params.page))
	if (params.sortBy) query.set("sortBy", params.sortBy)
	if (params.sortOrder) query.set("sortOrder", params.sortOrder)

	return query.toString()
}

function createFallbackMeta(limit: number): AdminUsersMeta {
	return {
		page: 1,
		limit,
		total: 0,
		totalPage: 1,
	}
}

export async function getAllUsersAction(
	params: AdminUsersQueryParams = {}
): Promise<AdminUsersResponse> {
	try {
		const queryString = buildQueryString(params)
		const url = queryString
			? `${BASE_URL}/api/v1/admin/getalluser?${queryString}`
			: `${BASE_URL}/api/v1/admin/getalluser`

		const res = await fetch(url, {
			method: "GET",
			headers: await getAuthHeader(),
			cache: "no-store",
		})

		const result = await res.json()

		if (!res.ok) {
			throw new Error(result.message || "Failed to fetch users")
		}

		return {
			success: true,
			statuscode: result.statuscode || res.status,
			message: result.message || "All users fetched successfully",
			data: Array.isArray(result.data) ? (result.data as AdminUser[]) : [],
			meta: result.meta || createFallbackMeta(params.limit ?? 10),
		}
	} catch (error: any) {
		return {
			success: false,
			message: error.message || "Failed to load users",
			data: [],
			meta: createFallbackMeta(params.limit ?? 10),
		}
	}
}

export async function updateUserStatusAction(userId: string, status: AdminUserStatus) {
	try {
		const methods = ["PUT", "PATCH", "POST"] as const
		let lastErrorMessage = "Failed to update user status"

		for (const method of methods) {
			const res = await fetch(`${BASE_URL}/api/v1/admin/updateuser-status/${userId}`, {
				method,
				headers: await getAuthHeader(),
				body: JSON.stringify({ status }),
				cache: "no-store",
			})

			const result = await res.json()

			if (res.ok) {
				revalidatePath("/admin-dashboard")

				return {
					success: true,
					message: result.message || "User status updated successfully",
					data: result.data,
				}
			}

			lastErrorMessage = result.message || lastErrorMessage

			if (![405, 404, 501].includes(res.status)) {
				throw new Error(lastErrorMessage)
			}
		}

		throw new Error(lastErrorMessage)
	} catch (error: any) {
		return {
			success: false,
			message: error.message || "Failed to update user status",
		}
	}
}
