'use server'

import { cookies } from "next/headers";

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "PROVIDER";
};

type LoginFormData = {
    email: string;
    password: string;
};
export const loginAction = async (formData: LoginFormData) => {
    console.log("[loginAction] formData:", formData);
   const {email,password} = formData;


    const payload = {
        email,
        password
    }
   
    console.log(process.env.BACKEND_URL);

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    const cookie = await cookies();

    if(data.success){
        cookie.set("accessToken", data.data.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 , // 1 days
        });

        cookie.set("refreshToken", data.data.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        }); 
        
        
    }

    return data;


}

export const registerAction = async (formData: RegisterFormData) => {
    const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    const cookie = await cookies();

    if (data.success && data.data?.accessToken && data.data?.refreshToken) {
        cookie.set("accessToken", data.data.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });

        cookie.set("refreshToken", data.data.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    return {
        ...data,
        success: Boolean(data.success),
    };
}