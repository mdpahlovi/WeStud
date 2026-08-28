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

/**
 * Never let a Server Action throw to the client (renders as a raw 500).
 */
async function strapiFetch(path: string, init?: RequestInit) {
    if (!process.env.SERVER_URL) {
        return {
            ok: false,
            status: 500,
            json: async () => ({ error: { message: "Server is not configured (SERVER_URL missing)" } }),
        } as Response;
    }

    try {
        return await fetch(`${baseUrl}${path}`, init);
    } catch (error) {
        console.error(`[actions] Strapi request failed: ${path}`, error);
        return {
            ok: false,
            status: 502,
            json: async () => ({ error: { message: "Cannot reach the authentication server" } }),
        } as Response;
    }
}

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
};

export async function signupUserAction({ firstName, lastName, email, password }: SignupUserActionProps) {
    const response = await strapiFetch("/auth/local/register", {
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
        cookieStore.set("token", data.jwt, cookieOptions);

        const user = await getUserWithRole(data.jwt, { clearOnError: false });

        if (!user) {
            return { success: false, message: "Signed up, but the profile could not be loaded. Please try signing in." };
        }

        return { success: true, message: "User signed up successfully", data: user };
    }
}

export async function signinUserAction({ email, password }: SigninUserActionProps) {
    const response = await strapiFetch("/auth/local", {
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
        return { success: false, message: data?.error?.message || "Invalid email or password" };
    } else {
        const cookieStore = await cookies();
        cookieStore.set("token", data.jwt, cookieOptions);

        const user = await getUserWithRole(data.jwt, { clearOnError: false });

        if (!user) {
            return { success: false, message: "Signed in, but the profile could not be loaded. Please try again." };
        }

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

/**
 * Verify a JWT via /users/me; clears the session cookie on failure.
 */
export async function verifyUserFromToken(token: string | undefined) {
    if (!token) {
        return null;
    }
    return await getUserWithRole(token);
}

async function getUserWithRole(token: string, { clearOnError = true }: { clearOnError?: boolean } = {}) {
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
        { encodeValuesOnly: true },
    );

    const response = await strapiFetch(`/users/me?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        if (clearOnError) {
            const cookieStore = await cookies();
            cookieStore.delete("token");
        }
        return null;
    } else {
        return data;
    }
}
