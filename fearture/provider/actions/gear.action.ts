"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.BACKEND_URL

export interface Category {
  id: string
  name: string
  description?: string
  image?: string | null
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

export interface GearPayload {
  name: string
  description: string
  rentPricePerDay: number
  discountPrice?: number
  stock: number
  brand: string
  image: string
  categoryId?: string
}

async function getAuthHeader() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}`,
  }
}

// 1. Fetch All Categories
export async function getCategoriesAction() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/category`, {
      method: "GET",
      cache: "no-store",
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || "Failed to fetch categories")

    return {
      success: true,
      data: (result.data || []) as Category[],
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to load categories",
      data: [] as Category[],
    }
  }
}

// 2. Create New Gear under a Specific Category: POST /api/v1/gear/:categoryId
export async function createGearAction(categoryId: string, data: GearPayload) {
  try {
    const headers = await getAuthHeader()
    const res = await fetch(`${BASE_URL}/api/v1/gear/${categoryId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || "Failed to create gear")

    revalidatePath("/provider-dashboard/gear")
    return {
      success: true,
      message: result.message || "Gear added successfully",
      data: result.data,
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" }
  }
}

// 3. Update Existing Gear: PATCH /api/v1/gear/:id
export async function updateGearAction(id: string, data: Partial<GearPayload>) {
  try {
    const headers = await getAuthHeader()
    const res = await fetch(`${BASE_URL}/api/v1/gear/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || "Failed to update gear")

    revalidatePath("/provider-dashboard/gear")
    return {
      success: true,
      message: result.message || "Gear updated successfully",
      data: result.data,
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" }
  }
}

// 4. Delete Gear: DELETE /api/v1/gear/:id
export async function deleteGearAction(id: string) {
  try {
    const headers = await getAuthHeader()
    const res = await fetch(`${BASE_URL}/api/v1/gear/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || "Failed to delete gear")

    revalidatePath("/provider-dashboard/gear")
    return { success: true, message: result.message || "Gear deleted successfully" }
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" }
  }
}



export const getAllGearbyProvider = async (id:string) => {
      const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/v1/gear/provider/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}`,
            },
            
        });

        // if (!response.ok) {
        //     throw new Error("Failed to fetch gear data");
        // }

        const data = await response.json();
         console.log("Fetched gear data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching gear data:", error);
        return [];
    }
}