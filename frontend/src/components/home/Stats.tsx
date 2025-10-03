const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Expert Instructors" },
    { value: "1000+", label: "Online Courses" },
    { value: "95%", label: "Success Rate" },
];

export default function Stats() {
    return (
        <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                            <p className="text-sm md:text-base opacity-90">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
