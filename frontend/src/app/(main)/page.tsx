import Courses from "@/components/home/Courses";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
    return (
        <>
            <Hero />
            <Stats />
            <Features />
            <Courses />
            <Testimonials />
        </>
    );
}
