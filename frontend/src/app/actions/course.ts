"use server";

import type { User } from "@/stores/useAuthStore";
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

    if (!response.ok) {
        return { success: false, message: "Failed to fetch courses", data: [] };
    }

    const data = await response.json();

    return { success: true, message: "Courses fetched successfully", data: data.data };
}

export async function getOneCourseAction(id: string): Promise<Response<Course | null>> {
    if (!id) {
        return { success: false, message: "Course ID is required", data: null };
    }

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

    if (!response.ok) {
        return { success: false, message: "Failed to fetch course", data: null };
    }

    const data = await response.json();

    return { success: true, message: "Course fetched successfully", data: data.data };
}

export async function enrollCourseAction({ course, user }: { course: Course; user: User }): Promise<Response> {
    if (!course?.id) {
        return { success: false, message: "Course ID is required" };
    }

    if (!user?.id) {
        return { success: false, message: "User authentication required" };
    }

    const enrollmentData = {
        data: {
            user: user.id,
            course: course.id,
            price: course.price,
            enrolled_date: new Date().toISOString(),
            progress: 0,
            status: "running",
        },
    };

    const response = await fetch(`${baseUrl}/enrollments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
    });

    console.log({ response });

    if (!response.ok) {
        return { success: false, message: "Failed to enroll in course" };
    }

    return { success: true, message: "Successfully enrolled in course" };
}
