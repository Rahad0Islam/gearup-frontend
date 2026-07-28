'use server'

export const getGearDetailsById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/v1/gear/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch gear data");
        }

        const data = await response.json();
         console.log("Fetched gear data:", data);
        return data.data;
    } catch (error) {
        console.error("Error fetching gear data:", error);
        return [];
    }
}