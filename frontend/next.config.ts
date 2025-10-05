import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "refreshing-renewal-6f66a388b1.strapiapp.com",
                port: "",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
