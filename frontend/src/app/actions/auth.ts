"use server";

import { cookies } from "next/headers";
import qs from "qs";

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

const baseUrl = `${process.env.SERVER_URL}/api`;

export async function signupUserAction({ firstName, lastName, email, password }: SignupUserActionProps) {
    const response = await fetch(`${baseUrl}/auth/local/register`, {
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
        cookieStore.set("token", data.jwt);

        const user = await getUserWithRole(data.jwt);

        return { success: true, message: "User signed up successfully", data: user };
    }
}

export async function signinUserAction({ email, password }: SigninUserActionProps) {
    const response = await fetch(`${baseUrl}/auth/local`, {
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
        cookieStore.set("token", data.jwt);

        const user = await getUserWithRole(data.jwt);

        return { success: true, message: "User signed in successfully", data: user };
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

    return await getUserWithRole(token);
}

async function getUserWithRole(token: string) {
    const queryParams = qs.stringify(
        {
            populate: {
                role: {
                    fields: ["name", "description"],
                },
                enrollments: {
                    fields: ["id", "documentId"],
                    populate: {
                        course: { fields: ["id", "documentId"] },
                    },
                },
            },
        },
        { encodeValuesOnly: true }
    );

    const response = await fetch(`${baseUrl}/users/me?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const cookieStore = await cookies();
        cookieStore.delete("token");
        return null;
    } else {
        return data;
    }
}
