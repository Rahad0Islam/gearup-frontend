'use server'

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const logout = async () => {
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
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${accessToken.value}`,
        },
    });
    const data = await res.json();
    console.log({data});
    cookie.delete("accessToken");
    cookie.delete("refreshToken");
    
    revalidateTag("getme",'max');

    return data;
}


export default logout;