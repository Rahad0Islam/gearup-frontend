"use server"

import { cookies } from "next/headers";


export const createCheckoutSession = async (rentalOrderId: string , paymentType: "RENTAL" | "LATE_FEE") => {


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

    const res =  await fetch(`${process.env.BACKEND_URL}/api/v1/payment/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken.value}`,
      },
      body: JSON.stringify({ rentalOrderId, paymentType }),
    })

    const data = await res.json()

    console.log("Checkout session response:", data)
    return data
    
}