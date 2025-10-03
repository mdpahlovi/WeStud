import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const courses = [
    {
        id: 1,
        title: "Full Stack Web Development",
        description: "Master modern web development with React, Next.js, and Node.js",
        image: "/course-image-01.png",
        duration: "12 weeks",
        students: 1234,
        price: "4000৳",
        badge: "Popular",
    },
    {
        id: 2,
        title: "Digital Marketing Mastery",
        description: "Learn social media marketing, SEO, and content strategy",
        image: "/course-image-02.jpg",
        duration: "8 weeks",
        students: 892,
        price: "4000৳",
        badge: "New",
    },
    {
        id: 3,
        title: "Data Science Fundamentals",
        description: "Python, Machine Learning, and Data Analysis from scratch",
        image: "/course-image-03.webp",
        duration: "10 weeks",
        students: 567,
        price: "6500৳",
        badge: "Trending",
    },
];

export default function CoursesPreview() {
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
                    <p className="text-base text-muted-foreground">Start your learning journey with our top-rated courses</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="pt-0 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                                {course.badge && (
                                    <Badge className="absolute top-4 right-4" variant="secondary">
                                        {course.badge}
                                    </Badge>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {course.students}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <span className="text-2xl font-bold">{course.price}</span>
                                <Button asChild>
                                    <Link href={`/courses/${course.id}`}>Enroll Now</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
