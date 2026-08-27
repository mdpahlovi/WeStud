"use server";

import { cookies } from "next/headers";
import qs from "qs";
import { verifyUserFromToken } from "./auth";

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
            video: {
                id: string;
                documentId: string;
                url: string;
            };
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
                    fields: ["title"],
                },
            },
            pagination: {
                page: 1,
                pageSize: 12,
            },
        },
        { encodeValuesOnly: true },
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
                            populate: {
                                video: {
                                    fields: ["url"],
                                },
                            },
                        },
                    },
                },
            },
        },
        { encodeValuesOnly: true },
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

/**
 * Authenticated variant of getOneCourseAction. Verifies the caller holds a valid
 * JWT and has an enrollment for the requested course before returning video
 * URLs. Use this on any page that renders paid content.
 */
export async function getEnrolledCourseAction(id: string): Promise<Response<Course | null>> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const verified = await verifyUserFromToken(token);
    if (!verified) {
        return { success: false, message: "Unauthorized", data: null };
    }

    const enrolledCourseIds: number[] = (verified.enrollments || []).map((e: { course: { id: number } }) => e.course.id);

    const { data: course, success, message } = await getOneCourseAction(id);
    if (!success || !course) {
        return { success: false, message, data: null };
    }

    if (!enrolledCourseIds.includes(course.id)) {
        return { success: false, message: "Not enrolled in this course", data: null };
    }

    return { success: true, message: "Course fetched successfully", data: course };
}

export async function enrollCourseAction({ course }: { course: Course }): Promise<Response> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Derive the user from the JWT — never trust client-sent identity.
    const verified = await verifyUserFromToken(token);
    if (!verified) {
        return { success: false, message: "Unauthorized" };
    }

    // The UI hides the button, but a hand-crafted request can still hit this.
    const alreadyEnrolled = (verified.enrollments || []).some((e: { course: { id: number } }) => e.course.id === course.id);
    if (alreadyEnrolled) {
        return { success: false, message: "Already enrolled in this course" };
    }

    const enrollmentData = {
        data: {
            user: verified.id,
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

export async function getEnrolledCoursesAction(): Promise<Response<Course[]>> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const verified = await verifyUserFromToken(token);
    if (!verified) {
        return { success: false, message: "Unauthorized", data: [] };
    }

    const queryParams = qs.stringify(
        {
            fields: ["id", "documentId"],
            populate: {
                enrollments: {
                    fields: ["id", "documentId"],
                    populate: {
                        course: {
                            populate: {
                                image: {
                                    fields: ["url"],
                                },
                                modules: {
                                    sort: ["order:asc"],
                                    fields: ["title"],
                                },
                            },
                        },
                    },
                },
            },
        },
        { encodeValuesOnly: true },
    );

    const response = await fetch(`${baseUrl}/users/me?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data?.error?.message || "Something went wrong", data: [] };
    } else {
        const courses = data?.enrollments?.map(({ course }: { course: Course }) => course) || [];
        return { success: true, message: "Enrolled courses fetched successfully", data: courses };
    }
}
