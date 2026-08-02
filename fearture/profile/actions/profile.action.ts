"use server"

import { cookies } from "next/headers"

const BASE_URL = process.env.BACKEND_URL

export interface ProfileData {
  id: string
  name: string
  email: string
  role: "CUSTOMER" | "PROVIDER" | "ADMIN"
  activeStatus: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProfileResult {
  success: boolean
  message?: string
  data?: ProfileData
}

async function getAuthHeader() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}`,
  }
}

export async function getProfileAction(): Promise<ProfileResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: await getAuthHeader(),
      cache: "no-store",
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to load profile",
      }
    }

    return {
      success: true,
      message: result.message,
      data: result.data as ProfileData,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to load profile",
    }
  }
}
