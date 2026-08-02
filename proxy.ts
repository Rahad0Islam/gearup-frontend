import jwt,{ JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtUtils } from './app/utils/jwtutils';
import getNewAccessToken from './app/utils/refreshtoken';
 
const AUTH_ROUTES = [
   '/login',
   '/register',
   
]
// This function can be marked `async` if using `await` inside

const PublicRoutes = [
    '/',
    '/gear',
    '/about',
    '/how-it-works'
   
]
export async function proxy(request: NextRequest) {
    const cookie = await cookies();
    const pathname = request.nextUrl.pathname;
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string): null;
    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string): null;
    console.log({pathname})
    if(!decodedAccessToken?.success && decodedRefreshToken?.success){
        const res = await getNewAccessToken();
        // console.log({res})
        if(res.success){
            const newAccessToken = res.data.accessToken;
            cookie.set("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 60 * 60 * 24 , // 1 days
            });
            // console.log("Access token refreshed successfully");
            accessToken = newAccessToken;

            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
        }
    }
    if(!decodedAccessToken?.success){
         cookie.delete("accessToken");
        //  return NextResponse.redirect(new URL('/login', request.url));
    }

    let userRole = null;
    if(decodedAccessToken?.success && decodedAccessToken.data){
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    if(accessToken && AUTH_ROUTES.includes(pathname)){
        if(userRole === "ADMIN"){
            return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        }else if(userRole === "PROVIDER"){
            return NextResponse.redirect(new URL('/provider-dashboard', request.url));
        }else if(userRole === "CUSTOMER"){
            return NextResponse.redirect(new URL('/customer-dashboard', request.url));
        }
        else{
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    const isPublicRoute = PublicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));

    if(!accessToken && !isPublicRoute && !isAuthRoute){
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname+(request.nextUrl.search || ''));
        return NextResponse.redirect(loginUrl);
    }

    if(pathname.startsWith('/admin-dashboard') && userRole !== "ADMIN"){
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    else if(pathname.startsWith('/provider-dashboard') && userRole !== "PROVIDER"){
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    else if(pathname.startsWith('/customer-dashboard') && userRole !== "CUSTOMER"){
        return NextResponse.redirect(new URL('/not-found', request.url));
    }


  

    return NextResponse.next();
}
 

export const config = {
  matcher:[
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}