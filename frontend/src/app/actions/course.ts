"use server";

import qs from "qs";

const baseUrl = `${process.env.SERVER_URL}/api/courses`;

type Course = {
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

type Response<T> = {
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

    const response = await fetch(`${baseUrl}?${queryParams}`, {
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

    const response = await fetch(`${baseUrl}/${id}?${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.log(response);
        return { success: false, message: "Failed to fetch course", data: null };
    }

    const data = await response.json();

    return { success: true, message: "Course fetched successfully", data: data.data };
}
