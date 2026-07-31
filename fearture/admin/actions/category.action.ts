"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.BACKEND_URL

export interface AdminCategory {
  id: string
  name: string
  description?: string | null
  image?: string | null
  createdAt?: string
  updatedAt?: string
  createdBy?: string | null
}

export interface CategoryPayload {
  name: string
  description: string
  image?: string | null
}

async function getAuthHeader() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}`,
  }
}

function normalizeCategoryList(result: any): AdminCategory[] {
  if (Array.isArray(result?.data)) return result.data as AdminCategory[]
  if (Array.isArray(result)) return result as AdminCategory[]
  return []
}

export async function getAllCategoriesAction() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/category`, {
      method: "GET",
      cache: "no-store",
      headers: await getAuthHeader(),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch categories")
    }

    return {
      success: true,
      message: result.message || "Categories fetched successfully",
      data: normalizeCategoryList(result),
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load categories",
      data: [] as AdminCategory[],
    }
  }
}

export async function createCategoryAction(payload: CategoryPayload) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/category/addcategory`, {
      method: "POST",
      headers: await getAuthHeader(),
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to create category")
    }

    revalidatePath("/admin-dashboard/categories")
    revalidatePath("/admin-dashboard/categories/create")

    return {
      success: true,
      message: result.message || "Category created successfully",
      data: result.data as AdminCategory,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create category",
    }
  }
}

export async function updateCategoryAction(id: string, payload: Partial<CategoryPayload>) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/category/updatecategory/${id}`, {
      method: "PUT",
      headers: await getAuthHeader(),
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to update category")
    }

    revalidatePath("/admin-dashboard/categories")
    revalidatePath("/admin-dashboard/categories/create")

    return {
      success: true,
      message: result.message || "Category updated successfully",
      data: result.data as AdminCategory,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update category",
    }
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/category/deletecategory/${id}`, {
      method: "DELETE",
      headers: await getAuthHeader(),
      cache: "no-store",
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete category")
    }

    revalidatePath("/admin-dashboard/categories")
    revalidatePath("/admin-dashboard/categories/create")

    return {
      success: true,
      message: result.message || "Category deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete category",
    }
  }
}