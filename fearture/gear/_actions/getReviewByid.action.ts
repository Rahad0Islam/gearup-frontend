'use server'

export const getReviewById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/v1/review/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch review data");
        }

        const data = await response.json();
         console.log("Fetched review data:", data);
        return data.data;
    } catch (error) {
        console.error("Error fetching review data:", error);
        return [];
    }
}