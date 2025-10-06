"use server";

import type { User } from "@/stores/useAuthStore";
import { cookies } from "next/headers";
import qs from "qs";

const baseUrl = `${process.env.SERVER_URL}/api`;

export type Course = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    duration: string;
    price: number;
    badge: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: {
        id: string;
        documentId: string;
        url: string;
    };
    modules: {
        id: string;
        documentId: string;
        title: string;
        description: string;
        classes: {
            id: string;
            documentId: string;
            title: string;
            description: string;
            duration: number;
        }[];
    }[];
};

export type Response<T = undefined> = T extends undefined
    ? {
          success: boolean;
          message: string;
      }
    : {
          success: boolean;
          message: string;
          data: T;
      };

export async function getAllCourseAction(): Promise<Response<Course[]>> {
    const queryParams = qs.stringify(
        {
            populate: {
                image: {
                    fields: ["url"],
                },
                modules: {
                    sort: ["order:asc"],
                    fields: ["title", "description"],
                },
            },
            pagination: {
                page: 1,
                pageSize: 12,
            },
        },
        { encodeValuesOnly: true }
    );

    const response = await fetch(`${baseUrl}/courses?${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data?.error?.message || "Something went wrong", data: [] };
    } else {
        return { success: true, message: "Courses fetched successfully", data: data.data };
    }
}

export async function getOneCourseAction(id: string): Promise<Response<Course | null>> {
    const queryParams = qs.stringify(
        {
            populate: {
                image: {
                    fields: ["url"],
                },
                modules: {
                    sort: ["order:asc"],
                    fields: ["title", "description"],
                    populate: {
                        classes: {
                            sort: ["order:asc"],
                            fields: ["title", "description", "duration"],
                        },
                    },
                },
            },
        },
        { encodeValuesOnly: true }
    );

    const response = await fetch(`${baseUrl}/courses/${id}?${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data?.error?.message || "Something went wrong", data: null };
    } else {
        return { success: true, message: "Course fetched successfully", data: data.data };
    }
}

export async function enrollCourseAction({ user, course }: { user: User; course: Course }): Promise<Response> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const enrollmentData = {
        data: {
            user: user.id,
            course: course.id,
            price: course.price,
            enrolled_date: new Date().toISOString(),
            progress: 0,
            statuss: "running",
        },
    };

    const response = await fetch(`${baseUrl}/enrollments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(enrollmentData),
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data?.error?.message || "Something went wrong" };
    } else {
        return { success: true, message: "Successfully enrolled in course" };
    }
}
