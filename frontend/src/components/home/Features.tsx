import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Shield, Trophy, Users, Zap } from "lucide-react";

const features = [
    {
        icon: Users,
        title: "Interactive Learning",
        description: "Customized learning paths for Students, Developers, Social Media Managers, and more.",
    },
    {
        icon: BookOpen,
        title: "Comprehensive Courses",
        description: "Access detailed modules, classes, and topics with recorded sessions available 24/7.",
    },
    {
        icon: Trophy,
        title: "Industry Certifications",
        description: "Earn recognized certificates upon course completion to boost your career.",
    },
    {
        icon: Clock,
        title: "Learn at Your Pace",
        description: "Flexible scheduling with lifetime access to course materials and updates.",
    },
    {
        icon: Shield,
        title: "Secure Platform",
        description: "Advanced authentication and data protection for a safe learning environment.",
    },
    {
        icon: Zap,
        title: "Interactive Learning",
        description: "Engage with quizzes, projects, and peer discussions for better retention.",
    },
];

export default function Features() {
    return (
        <section className="py-20 md:py-28 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WeStud?</h2>
                    <p className="text-base text-muted-foreground">We provide everything you need to succeed in your learning journey</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="border-none shadow-sm hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
