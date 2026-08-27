"use client";

import { actions } from "@/app/actions";
import type { Course } from "@/app/actions/course";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function EnrollButton({ course }: { course: Course }) {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [loading, startTransition] = useTransition();

    if (user?.enrollments.some((e) => e.course.documentId === course.documentId)) {
        return (
            <Button size="lg" className="w-full" disabled>
                Enrolled
            </Button>
        );
    } else {
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
                            const res = await actions.course.enrollCourseAction({ course });
                            if (res?.success) {
                                toast.success(res.message);
                                const updated = await actions.auth.getUser();
                                setUser(updated);
                            } else {
                                toast.error(res.message);
                            }
                        });
                    }
                }}
            >
                Enroll Now
            </Button>
        );
    }
}
