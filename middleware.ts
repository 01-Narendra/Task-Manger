import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;

    // Redirect to sign-in page if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow only if token exists
    },
  }
);

// Match only these routes for protection
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"], // Add your protected routes
};
