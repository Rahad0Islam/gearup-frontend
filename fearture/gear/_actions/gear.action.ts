'use server'

export interface GearListQueryParams {
    name?: string
    description?: string
    page?: number
    limit?: number
    searchTerm?: string
    rentPricePerDay?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
    brand?: string
    status?: string
}

function buildQueryString(params: GearListQueryParams) {
    const query = new URLSearchParams()

    if (params.name) query.set("name", params.name)
    if (params.description) query.set("description", params.description)
    if (typeof params.page === "number") query.set("page", String(params.page))
    if (typeof params.limit === "number") query.set("limit", String(params.limit))
    if (params.searchTerm) query.set("searchTerm", params.searchTerm)
    if (typeof params.rentPricePerDay === "number") {
        query.set("rentPricePerDay", String(params.rentPricePerDay))
    }
    if (params.sortBy) query.set("sortBy", params.sortBy)
    if (params.sortOrder) query.set("sortOrder", params.sortOrder)
    if (params.brand) query.set("brand", params.brand)
    if (params.status) query.set("status", params.status)

    return query.toString()
}

export const getAllGear = async (params: GearListQueryParams = {}) => {
    try {
        const queryString = buildQueryString(params)
        const url = queryString
            ? `${process.env.BACKEND_URL}/api/v1/gear?${queryString}`
            : `${process.env.BACKEND_URL}/api/v1/gear`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch gear data")
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching gear data:", error)
        return { data: [], meta: { page: 1, limit: params.limit ?? 10, total: 0, totalPage: 1 } }
    }
}