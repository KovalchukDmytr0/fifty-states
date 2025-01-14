import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define public paths that don't require authentication
const PUBLIC_PATHS = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password", "/api/auth/signin", "/api/auth/signup"];

// Define protected paths and their required roles
const PROTECTED_ROUTES = {
  ADMIN: {
    paths: ["/admin", "/api/admin", "/admin/users"],
    roles: ["SUPERADMIN"]
  },
  DASHBOARD: {
    paths: ["/dashboard"],
    roles: ["ADMINISTRATOR", "STAKEHOLDER"]
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware processing path:', pathname);

  // Allow public paths without authentication
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    console.log('Public path accessed:', pathname);
    return NextResponse.next();
  }

  // Get the token from NextAuth.js
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log('Token present:', !!token);

  // If no token is present, redirect to sign-in
  if (!token) {
    console.log('No token, redirecting to sign-in');
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  try {
    const userRole = token.role as string;
    console.log('User role:', userRole, 'accessing path:', pathname);

    // Check admin routes
    if (PROTECTED_ROUTES.ADMIN.paths.some(path => pathname.startsWith(path))) {
      if (!PROTECTED_ROUTES.ADMIN.roles.includes(userRole)) {
        console.log('Unauthorized admin access, redirecting to dashboard');
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Redirect SuperAdmin to users page after sign in
    if ((pathname === "/" || pathname === "/dashboard") && userRole === "SUPERADMIN") {
      console.log('SuperAdmin accessing root or dashboard, redirecting to users page');
      return NextResponse.redirect(new URL("/admin/users", request.url));
    }

    // Check dashboard routes
    if (PROTECTED_ROUTES.DASHBOARD.paths.some(path => pathname.startsWith(path))) {
      if (!PROTECTED_ROUTES.DASHBOARD.roles.includes(userRole)) {
        console.log('Unauthorized dashboard access, redirecting to sign-in');
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    // Clear the invalid token and redirect to sign-in
    const response = NextResponse.redirect(new URL("/auth/sign-in", request.url));
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}; 