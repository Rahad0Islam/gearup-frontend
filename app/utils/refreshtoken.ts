"use server"

import { cookies } from "next/headers";



const getNewAccessToken  = async () => {
    const cookie = await cookies();
    const refreshToken = cookie.get("refreshToken");
    if (!refreshToken) {
        return ({
            success: false,
            statuscode: 401,
            message: "refresh token not found",
            data: null
        })
    }

    console.log("Attempting to refresh access token with refresh token:", refreshToken.value);
    
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/refreshtoken`, {
        method: "POST",
        headers: {
            Cookie: `refreshToken=${refreshToken.value}`
        },
        cache: "no-cache",
       
    });

    const data = await res.json();
 
    return data;
}

export default getNewAccessToken;