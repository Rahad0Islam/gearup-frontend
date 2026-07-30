"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Helper function
async function executeOrderAction(endpoint: string) {
  try {
    const cookie = await cookies()
    const accessToken = cookie.get("accessToken")

    const res = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
      method: "PATCH", // or POST depending on your backend route setup
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken?.value}`,
      },
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to update order")
    }

    // Purge the route cache on the server
    revalidatePath("/provider-dashboard/rental") // Replace with your exact route URL

    return {
      success: true,
      message: result.message || "Order updated successfully",
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Action failed",
    }
  }
}
// 1. Confirm Order
export async function confirmOrderAction(orderId: string) {
  return executeOrderAction(`/api/v1/rental-order/confirm/${orderId}`)
}

// 2. Mark as Picked Up
export async function pickupOrderAction(orderId: string) {
  return executeOrderAction(`/api/v1/rental-order/pickup/${orderId}`)
}

// 3. Mark as Returned
export async function returnOrderAction(orderId: string) {
  return executeOrderAction(`/api/v1/rental-order/return/${orderId}`)
}

// 4. Cancel Order
export async function cancelOrderAction(orderId: string) {
  return executeOrderAction(`/api/v1/rental-order/cancel/${orderId}`)
}