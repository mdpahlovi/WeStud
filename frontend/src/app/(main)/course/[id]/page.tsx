import { actions } from "@/app/actions";
import EnrollButton from "@/components/course/EnrollButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Play } from "lucide-react";
import markdown from "markdown-it";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data } = await actions.course.getOneCourseAction(id);

    if (!data) {
        return notFound();
    }

    const totalClasses = data.modules.reduce((acc, module) => acc + module.classes.length, 0);
    const totalDuration = data.modules.reduce((acc, module) => acc + module.classes.reduce((sum, cls) => sum + cls.duration, 0), 0);

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="relative h-96 overflow-hidden">
                <Image
                    src={`${process.env.SERVER_URL}${data.image.url}`}
                    alt={data.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 lg:container mx-auto p-6 lg:p-8 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {data.duration}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            {totalClasses} Classes
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="lg:container mx-auto p-6 lg:p-8 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent>
                            <div
                                className="markdown-content"
                                dangerouslySetInnerHTML={{ __html: markdown().render(data.description) }}
                            ></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Course Content</CardTitle>
                            <CardDescription>
                                {data.modules.length} modules · {totalClasses} classes · {Math.floor(totalDuration / 60)}h{" "}
                                {totalDuration % 60}m total
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {data.modules.map((module, moduleIndex) => (
                                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-start sm:items-center gap-2 sm:gap-4 text-left flex-1 pr-2">
                                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0 mt-1 sm:mt-0">
                                                    {moduleIndex + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-sm sm:text-base mb-0.5 pr-2">{module.title}</h3>
                                                    <p className="font-normal text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                        {module.description}
                                                    </p>
                                                    <Badge variant="outline" className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs inline-flex">
                                                        <span className="truncate">
                                                            {module.classes.length} classes ·{" "}
                                                            {module.classes.reduce((sum, cls) => sum + cls.duration, 0)} min
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {module.classes.map((cls, classIndex) => (
                                                <div
                                                    key={cls.id}
                                                    className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted text-muted-foreground text-[10px] sm:text-xs flex-shrink-0 mt-0.5 sm:mt-0">
                                                        {classIndex + 1}
                                                    </div>
                                                    <Play className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-xs sm:text-sm line-clamp-1">{cls.title}</h4>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
                                                            {cls.description}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[10px] sm:text-xs flex-shrink-0 self-start sm:self-center"
                                                    >
                                                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                                        <span className="hidden xs:inline">{cls.duration} min</span>
                                                        <span className="xs:hidden">{cls.duration}m</span>
                                                    </Badge>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 sticky top-6">
                    <Card>
                        <CardHeader className="text-center">
                            <CardDescription>Course Price</CardDescription>
                            <CardTitle className="text-5xl font-bold">৳{data.price.toLocaleString()}</CardTitle>
                            <CardDescription>One-time payment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <EnrollButton course={data} />

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Lifetime access</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Certificate of completion</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Access on mobile & desktop</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>30-day money-back guarantee</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
