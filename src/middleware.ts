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

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  ROLE_DASHBOARDS,
  ROLE_PERMISSIONS,
  SALES_DEPT_CONFIG,
} from "@/utils/role-routes";

// Helper to determine user's dashboard
function getDashboard(token: any) {
  if (token.system === 'service-booking') {
    return "/service-booking/dashboard";
  }

  const userRole = token?.user_role as keyof typeof ROLE_DASHBOARDS;
  const userDept = token?.department as string;

  let dashboard = ROLE_DASHBOARDS[userRole] || "/";

  if (
    (userRole === "SALES01" ||
      userRole === "SALES02" ||
      userRole === "SALES03") &&
    SALES_DEPT_CONFIG[userDept]
  ) {
    dashboard = SALES_DEPT_CONFIG[userDept].dashboard;
  }

  return dashboard;
}

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Service Booking Sub-system Middleware
  if (pathname.startsWith("/service-booking")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isLoginPage = pathname === "/service-booking/login";

    // CROSS-AUTH PROTECTION: If user is logged into the WRONG system, redirect them
    if (token && token.system !== 'service-booking') {
      const destination = getDashboard(token);
      return NextResponse.redirect(new URL(destination, req.url));
    }

    // Handle root path access
    if (pathname === "/service-booking" || pathname === "/service-booking/") {
      if (token) {
        return NextResponse.redirect(new URL("/service-booking/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/service-booking/login", req.url));
      }
    }

    // Protect other routes
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL("/service-booking/login", req.url));
    }

    if (token && isLoginPage) {
      return NextResponse.redirect(new URL("/service-booking/dashboard", req.url));
    }

    // Allow the login page to load
    if (isLoginPage) {
      return NextResponse.next();
    }

    // If authenticated and on a service-booking route, allow access
    return NextResponse.next();
  }

  const publicRoutes = ["/login", "/api/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  );

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  // CROSS-AUTH PROTECTION: If a service-booking user tries to access general admin routes
  if (isAuth && token.system === 'service-booking') {
    const destination = getDashboard(token);
    return NextResponse.redirect(new URL(destination, req.url));
  }

  if (!isAuth) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = token?.user_role as keyof typeof ROLE_DASHBOARDS;
  const userDept = token?.department as string;

  if (pathname === "/login") {
    const destination = getDashboard(token);
    return NextResponse.redirect(new URL(destination, req.url));
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  const allowedPrefixes = ROLE_PERMISSIONS[userRole] || [];
  const isAllowedRole = allowedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAllowedRole) {
    const destination = getDashboard(token);
    return NextResponse.redirect(new URL(destination, req.url));
  }

  if (
    userRole === "SALES01" ||
    userRole === "SALES02" ||
    userRole === "SALES03"
  ) {
    const config = SALES_DEPT_CONFIG[userDept];

    if (config) {
      if (!pathname.startsWith(config.allowedPath) && !pathname.startsWith("/profile")) {
        return NextResponse.redirect(new URL(config.dashboard, req.url));
      }
    }
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
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|svg|gif)).*)",
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg)).*)",
  ],
};
