import type { NextConfig } from "next";

const config: NextConfig = {
    output: "standalone",
    reactStrictMode: true,
    poweredByHeader: false,
    // logging: {
    //     fetches: {
    //         fullUrl: true,
    //     },
    // },
    images: { unoptimized: true },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    experimental: {
        reactCompiler: true,
        authInterrupts: true,
    },
    transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};
export default config;
