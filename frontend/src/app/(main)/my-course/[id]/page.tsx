import { actions } from "@/app/actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Play } from "lucide-react";
import { notFound } from "next/navigation";

export default async function MyCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data } = await actions.course.getOneCourseAction(id);

    if (!data) {
        return notFound();
    }

    const totalClasses = data.modules.reduce((acc, module) => acc + (module.classes?.length || 0), 0);
    const totalDuration = data.modules.reduce(
        (acc, module) => acc + module.classes?.reduce((sum, cls) => sum + (cls.duration || 0), 0) || 0,
        0
    );

    return (
        <section className="lg:container mx-auto p-6 lg:p-8 grid gap-6">
            <Card className="py-0 overflow-hidden gap-0">
                {data.modules[0].classes[0].video.url && (
                    <video
                        src={`${process.env.SERVER_URL}${data.modules[0].classes[0].video.url}`}
                        controls
                        autoPlay
                        className="aspect-video"
                    />
                )}
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Your Progress</span>
                            <span className="font-semibold">{35}%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                    </div>
                    <Button className="w-full" size="lg">
                        Continue Learning
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{data.title}</CardTitle>
                    <CardDescription>
                        {data.modules.length} modules · {totalClasses} classes · {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                        total
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
        </section>
    );
}
