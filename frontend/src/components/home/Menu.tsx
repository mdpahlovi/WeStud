"use client";

import { actions } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { useTransition } from "react";

export default function MenuButton() {
    const { user, setUser } = useAuthStore();
    const [loading, startTransition] = useTransition();

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                    loading={loading}
                    onClick={() => {
                        startTransition(async () => {
                            await actions.auth.signoutUserAction();
                            setUser(null);
                        });
                    }}
                >
                    Sign Out
                </Button>
            </div>
        );
    } else {
        return (
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Get Started</Link>
                </Button>
            </div>
        );
    }
}
