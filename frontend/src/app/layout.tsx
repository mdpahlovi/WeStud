import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import AuthProvider from "./AuthProvider";

export const poppins = Poppins({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export const metadata = {
    title: {
        template: "%s - WeStud",
        default: "WeStud - Study Effectively",
    },
    description: "WeStud is a platform for students to study effectively",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={poppins.className}>
            <body>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" />
                </AuthProvider>
            </body>
        </html>
    );
}
