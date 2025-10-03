import Navbar from "@/components/home/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="bg-muted/50  border-t">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
                    <p className="text-muted-foreground">&copy; 2025 WeStud. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
