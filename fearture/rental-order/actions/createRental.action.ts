"use server"

import { cookies } from "next/headers";

export interface CreateRentalPayload {
  pickupDate: string
  returnDate: string
  items: {
    gearItemId: string
    quantity: number
  }[]
}

export async function createRentalOrderAction(payload: CreateRentalPayload) {
  try {
    const cookie = await cookies();
        const accessToken = cookie.get("accessToken");
        if (!accessToken) {
            return ({
                success: false,
                statuscode: 401,
                message: "user not logged in",
                data: null
            })
        }
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/rental-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken.value}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating rental order:", error)
    return {
      success: false,
      message: "Failed to create rental order",
    }
  }
}