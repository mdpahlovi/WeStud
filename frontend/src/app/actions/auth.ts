"use server";

import { cookies } from "next/headers";

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

const config = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

const baseUrl = `${process.env.SERVER_URL}/api/auth`;

export async function signupUserAction({ firstName, lastName, email, password }: SignupUserActionProps) {
    const response = await fetch(`${baseUrl}/local/register`, {
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
        return { success: true, message: "User signed up successfully", data: data?.user };
    }
}

export async function signinUserAction({ email, password }: SigninUserActionProps) {
    const response = await fetch(`${baseUrl}/local`, {
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
        return { success: true, message: "User signed in successfully", data: data?.user };
    }
}

export async function signoutUserAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}

export async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const response = await fetch(`${baseUrl}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        cookieStore.delete("token");
        return null;
    } else {
        return data;
    }
}
