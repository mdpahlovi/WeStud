import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProt = protectedRoutes.includes(path);
    const isPubl = publicRoutes.includes(path);

    const cookie = (await cookies()).get("token")?.value;

    if (isProt && !cookie) {
        return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }

    if (isPubl && cookie && !req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
