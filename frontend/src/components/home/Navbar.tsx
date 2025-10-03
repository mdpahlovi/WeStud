import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="Logo" width={24} height={24} />
                        <h1 className="text-2xl font-bold">WeStud</h1>
                    </Link>

                    <div className="flex md:items-center md:space-x-4">
                        <Button variant="ghost" asChild>
                            <Link href="/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
