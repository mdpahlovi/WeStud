import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-6 p-6 md:p-10">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={48} height={48} />
                </Link>
                {children}
            </div>
            <div className="bg-muted relative hidden lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/auth.webp"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
