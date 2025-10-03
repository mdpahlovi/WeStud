import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/5 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <Badge className="inline-flex" variant="secondary">
                            🎓 #1 Online Learning Platform
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            Master New Skills with{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">WeStud</span>
                        </h1>

                        <p className="text-base text-muted-foreground max-w-2xl">
                            Access world-class courses, expert instructors, and a community of learners. Transform your career with
                            role-based learning paths tailored just for you.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="group">
                                Start Learning Now
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button size="lg" variant="outline" className="group">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div>
                                <p className="text-2xl font-bold">10K+</p>
                                <p className="text-sm text-muted-foreground">Active Students</p>
                            </div>
                            <div className="h-12 w-px bg-border" />
                            <div>
                                <p className="text-2xl font-bold">500+</p>
                                <p className="text-sm text-muted-foreground">Courses</p>
                            </div>
                            <div className="h-12 w-px bg-border" />
                            <div>
                                <p className="text-2xl font-bold">4.9★</p>
                                <p className="text-sm text-muted-foreground">Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative lg:pl-8">
                        <div className="relative mx-auto w-full max-w-lg">
                            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <Image src="/hero.jpg" alt="Hero" width={500} height={500} className="w-full h-full object-cover" />
                            </div>

                            <div className="absolute -top-4 -right-4 bg-background border rounded-lg p-4 shadow-lg">
                                <p className="text-sm font-semibold">Live Classes</p>
                                <p className="text-xs text-muted-foreground">Every day at 8 PM</p>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-background border rounded-lg p-4 shadow-lg">
                                <p className="text-sm font-semibold">Get Certified</p>
                                <p className="text-xs text-muted-foreground">Industry recognized</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
