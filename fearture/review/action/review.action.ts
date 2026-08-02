"use server"

import { cookies } from "next/dist/server/request/cookies"

export interface ReviewData {
  id: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
  rentalOrderId: string
  customerId: string
  gearItemId: string
}

export interface CreateReviewPayload {
  rentalOrderId: string
  rating: number
  comment: string
}

export interface UpdateReviewPayload {
  rating: number
  comment: string
}


// 1. Create Review Action
export async function createReviewAction(payload: CreateReviewPayload) {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get("accessToken");
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if required by backend
        cookie: `accessToken=${accessToken?.value}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to submit review")
    }

    const reviewData = Array.isArray(result.data) ? result.data[0] : result.data

    return {
      success: true,
      message: result.message,
      data: reviewData as ReviewData,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong while submitting review",
    }
  }
}

// 2. Update Review Action
export async function updateReviewAction(reviewId: string, payload: UpdateReviewPayload) {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get("accessToken");
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/review/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
       
        cookie: `accessToken=${accessToken?.value}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to update review")
    }

    const reviewData = Array.isArray(result.data) ? result.data[0] : result.data

    return {
      success: true,
      message: result.message || "Review updated successfully",
      data: reviewData as ReviewData,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong while updating review",
    }
  }
}

// Add this to your existing actions/review.ts file

export async function getReviewByIdAction(reviewId: string) {
  try {
    console.log("Fetching review by ID:", reviewId)
    const cookie = await cookies();
    const accessToken = cookie.get("accessToken");
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/review/${reviewId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken?.value}`,
      },
      cache: "no-store",
    })

    const result = await res.json()
    console.log("Fetched review by ID:", result)
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch review")
    }

    const reviewData = Array.isArray(result.data) ? result.data[0] : result.data

    return {
      success: true,
      data: reviewData as ReviewData,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch review",
    }
  }
}



// Add to actions/review.ts

// 3. Delete Review Action
export async function deleteReviewAction(reviewId: string) {
  try {

    console.log("Deleting review with ID:", reviewId) 
    const cookie = await cookies();
    const accessToken = cookie.get("accessToken");
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/review/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken?.value}`,
      },
      cache: "no-store",
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete review")
    }

    return {
      success: true,
      message: result.message || "Review deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong while deleting review",
    }
  }
}

export async function getReviewByGearAndUserAction(
  gearItemId: string,
  customerId: string
) {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get("accessToken");
    const payload = {
      gearItemId,
      customerId,
    }

    console.log({payload})
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/review/getreviewbygearanduser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
            cookie: `accessToken=${accessToken?.value}`,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    )

    const result = await res.json()
    console.log("Fetched review by gear and user:", result)
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch review")
    }

    // Handles response whether data comes back as an array [review] or object
    const reviewData = Array.isArray(result.data) ? result.data[0] : result.data

    return {
      success: true,
      data: (reviewData || null) as ReviewData | null,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch review",
    }
  }
}