"use server"

import { cookies } from "next/headers";



const getme = async () => {
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

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/me`, {
        headers: {
            // "Authorization": `Bearer ${accessToken.value}`
            Cookie: `accessToken=${accessToken.value}`
        },
        cache: "no-cache",
       
    });

    const data = await res.json();
    console.log({data});
    return data;
}

export default getme;