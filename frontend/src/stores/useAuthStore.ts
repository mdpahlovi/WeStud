import { create } from "zustand";

export type User = {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    role: {
        id: number;
        documentId: string;
        name: string;
        description: string;
    };
    enrollments: {
        id: number;
        documentId: string;
        course: {
            id: number;
            documentId: string;
        };
    }[];
};

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
