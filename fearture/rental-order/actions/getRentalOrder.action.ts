"use server"

import { cookies } from "next/headers";



export async function getRentalOrder() {
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken.value}`,
      },
    
    })

    const data = await response.json()
    // console.log("Fetched rental orders:", data)
    return data.data
  } catch (error) {
    console.error("Error creating rental order:", error)
    return {
      success: false,
      message: "Failed to create rental order",
    }
  }
}