/* eslint-disable @typescript-eslint/no-explicit-any */
// import {NextResponse} from "next/server";
// import {getToken} from "next-auth/jwt";
//
// export async function middleware(req: any) {
//     // const publicRoutes = ["/login", "/", "/admin", "/admin/star-rating", "/chat-bot"];
//     const publicRoutes = ["/login", "/", "/api/auth"];
//
//     const {pathname} = req.nextUrl;
//
//     if (publicRoutes.includes(pathname)) {
//         return NextResponse.next();
//     }
//
//     const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
//
//     if (!token) {
//         return NextResponse.redirect(new URL("/login", req.url));
//     }
//
//     return NextResponse.next();
// }
//
// export const config = {
//     // matcher: [
//     //     "/((?!_next/static|_next/image|favicon.ico|api/auth|api/|.*\\.png$|.*\\.jpg$).*)",
//     // ],
//
//     matcher: [
//         "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|svg)).*)",
//     ],
// };


import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {ROLE_DASHBOARDS, ROLE_PERMISSIONS} from "@/utils/role-routes";

export async function middleware(req: any) {
    // const publicRoutes = ["/login", "/", "/admin", "/admin/star-rating", "/chat-bot"];

    const { pathname } = req.nextUrl;

    const publicRoutes = ["/login", "/", "/api/auth"];
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"));

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;

    if (!isAuth) {
        if (isPublicRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token?.user_role as keyof typeof ROLE_DASHBOARDS;

    if (pathname === "/login") {
        const destination = ROLE_DASHBOARDS[userRole] || "/";
        return NextResponse.redirect(new URL(destination, req.url));
    }

    if (pathname === "/") {
        return NextResponse.next();
    }

    const allowedPrefixes = ROLE_PERMISSIONS[userRole] || [];
    const isAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix));


    if (!isAllowed) {
        const destination = ROLE_DASHBOARDS[userRole] || "/";
        return NextResponse.redirect(new URL(destination, req.url));
    }

    // const {pathname} = req.nextUrl;
    //
    // if (publicRoutes.includes(pathname)) {
    //     return NextResponse.next();
    // }
    //
    // // const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    //
    // if (!token) {
    //     return NextResponse.redirect(new URL("/login", req.url));
    // }

    return NextResponse.next();
}

export const config = {
    // matcher: [
    //     "/((?!_next/static|_next/image|favicon.ico|api/auth|api/|.*\\.png$|.*\\.jpg$).*)",
    // ],

    matcher: [
        // "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|svg)).*)",
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg)).*)",
    ],
};


