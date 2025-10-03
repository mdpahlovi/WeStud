"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { actions } from "./actions";

const protectedRoutes = ["/dashboard"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, setUser } = useAuthStore();
    const [loading, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const currUser = await actions.auth.getUser();
            setUser(currUser);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (protectedRoutes.includes(pathname) && !user) {
            router.replace("/signin");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, user]);

    if (loading) {
        return (
            <main className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </main>
        );
    } else {
        return children;
    }
}
