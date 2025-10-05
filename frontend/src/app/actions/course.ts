"use server";

const baseUrl = `${process.env.SERVER_URL}/api/courses`;

type CoursesResponse = {
    success: boolean;
    message: string;
    data: {
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
    }[];
};

export async function getAllCourseAction(): Promise<CoursesResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append("populate[image][fields][0]", "url");

    queryParams.append("pagination[page]", "1");
    queryParams.append("pagination[pageSize]", "12");

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
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

export async function getOneCourseAction(id: string) {
    if (!id) {
        return { success: false, message: "Course ID is required" };
    }

    const queryParams = new URLSearchParams();

    queryParams.append("populate[image][fields][0]", "url");

    queryParams.append("populate[modules][populate][classes][fields][0]", "title");
    queryParams.append("populate[modules][populate][classes][fields][1]", "description");
    queryParams.append("populate[modules][populate][classes][fields][2]", "duration");
    queryParams.append("populate[modules][populate][classes][fields][3]", "order");

    queryParams.append("populate[modules][sort][0]", "order:asc");

    const response = await fetch(`${baseUrl}/${id}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return { success: false, message: "Failed to fetch course" };
    }

    const data = await response.json();

    return { success: true, message: "Course fetched successfully", data: data.data };
}
