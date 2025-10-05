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
                        await actions.course.enrollCourseAction({ course: course, user: user }).then((res) => {
                            if (res?.success) {
                                toast.success(res.message);
                            } else {
                                toast.error(res.message);
                            }
                        });
                    });
                }
            }}
        >
            Enroll Now
        </Button>
    );
}
