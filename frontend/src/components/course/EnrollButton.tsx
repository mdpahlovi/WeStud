"use client";

import { actions } from "@/app/actions";
import type { Course } from "@/app/actions/course";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function EnrollButton({ course }: { course: Course }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, startTransition] = useTransition();

    return (
        <Button
            size="lg"
            className="w-full"
            loading={loading}
            onClick={() => {
                if (!user) {
                    router.push("/signin");
                } else {
                    startTransition(async () => {
                        await actions.course.enrollCourseAction({ course: course, user: user });
                    });
                }
            }}
        >
            Enroll Now
        </Button>
    );
}
