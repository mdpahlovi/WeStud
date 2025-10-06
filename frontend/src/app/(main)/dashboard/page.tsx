"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
            <h2 className="text-2xl font-semibold">Welcome, {user?.username || ""}</h2>
            <Badge className="px-3 py-1.5">{user?.role?.name || "·····"}</Badge>
        </div>
    );
}
