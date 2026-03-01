import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Optional: Add specific role checks if needed
        // if (path.startsWith("/admin") && token?.role !== "ADMIN") {
        //   return NextResponse.redirect(new URL("/dashboard", req.url));
        // }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/student/:path*", "/faculty/:path*", "/admin/:path*"],
};
