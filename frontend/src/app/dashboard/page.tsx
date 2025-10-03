import Courses from "@/components/home/Courses";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <Courses />
            <Testimonials />
            <footer className="bg-muted/50 border-t">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
                    <p className="text-muted-foreground">&copy; 2025 WeStud. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
