import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Presence check only — the cookie value is not validated here. AuthProvider
// performs the real validation via /users/me.
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/signin", "/signup"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.includes(path);
    const isPublic = publicRoutes.includes(path);

    const cookie = (await cookies()).get("token")?.value;

    if (isProtected && !cookie) {
        return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }

    if (isPublic && cookie) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
