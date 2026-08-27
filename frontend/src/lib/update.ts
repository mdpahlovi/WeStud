export function resolveImage(image: string | null | undefined): string {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/uploads/")) return `${process.env.SERVER_URL}${image}`;
    return image;
}
