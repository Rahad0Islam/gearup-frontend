"use server"

import { cookies } from "next/dist/server/request/cookies";
import { PaymentHistoryResponse, PaymentQueryParams } from "../types/payment"

export async function getPaymentHistory(
  
  params?: PaymentQueryParams
): Promise<PaymentHistoryResponse> {
  const query = new URLSearchParams()
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken");
 
  if (params?.paymentType && params.paymentType !== "ALL") {
    query.append("paymentType", params.paymentType)
  }
  if (params?.status && params.status !== "ALL") {
    query.append("status", params.status)
  }
  if (params?.paymentMethod && params.paymentMethod !== "ALL") {
    query.append("paymentMethod", params.paymentMethod)
  }
  if (params?.page) {
    query.append("page", params.page.toString())
  }
  if (params?.limit) {
    query.append("limit", params.limit.toString())
  }
  if (params?.customerId) {
    query.append("customerId", params.customerId)
  }
  
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/payment/payment-history?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken?.value}`,
        // Add authorization headers if required by your backend
      },
      cache: "no-store",
    })

    // if (!res.ok) {
    //   throw new Error(`Failed to fetch payment history: ${res.statusText}`)
    // }

    const data = await res.json();

    console.log("Fetched payment history:", data)
    return data ;


  } catch (error) {
    console.error("Payment history fetch error:", error)
    return {
      success: false,
      statuscode: 500,
      message: "Error fetching payment history",
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
    }
  }
}