import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Web Developer",
        content: "WeStud transformed my career. The role-based learning path was exactly what I needed.",
        rating: 5,
        avatar: "/api/placeholder/40/40",
    },
    {
        name: "Mike Chen",
        role: "Student",
        content: "The recorded classes feature is amazing. I can learn at my own pace and revisit topics anytime.",
        rating: 5,
        avatar: "/api/placeholder/40/40",
    },
    {
        name: "Emily Davis",
        role: "Social Media Manager",
        content: "Industry-relevant content and expert instructors. Best investment in my professional growth!",
        rating: 5,
        avatar: "/api/placeholder/40/40",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 md:py-28 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
                    <p className="text-muted-foreground">Join thousands of satisfied learners who have achieved their goals</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-none shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground">{testimonial.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
