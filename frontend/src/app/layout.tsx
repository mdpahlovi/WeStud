import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

export const plusJakartaSans = Plus_Jakarta_Sans({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--font-plus-jakarta-sans",
});
export const outfit = Outfit({
    weight: ["600", "700"],
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata = {
    title: {
        template: "%s - MD Pahlovi",
        default: "MD Pahlovi - Portfolio",
    },
    description: "This is MD Pahlovi. I am a Web Developer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
            <body>{children}</body>
        </html>
    );
}
