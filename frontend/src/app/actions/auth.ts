"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

type SignupUserActionProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type SigninUserActionProps = {
    email: string;
    password: string;
};

export type User = {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
};

const config = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

export async function signupUserAction({ firstName, lastName, email, password }: SignupUserActionProps) {
    const url = new URL("/api/auth/local/register", process.env.SERVER_URL);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: `${firstName} ${lastName}`,
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data?.error?.message || "Something went wrong" };
    } else {
        const cookieStore = await cookies();
        cookieStore.set("token", data.jwt, config);
        redirect("/dashboard", RedirectType.replace);
    }
}

export async function signinUserAction({ email, password }: SigninUserActionProps) {
    const url = new URL("/api/auth/local", process.env.SERVER_URL);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identifier: email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data?.error?.message || "Something went wrong" };
    } else {
        const cookieStore = await cookies();
        cookieStore.set("token", data.jwt, config);
        redirect("/dashboard", RedirectType.replace);
    }
}
