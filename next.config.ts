/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip
 * env validation. This is especially useful for Docker builds.
 */
import { DateTime } from "luxon";
import type { NextConfig } from "next";
import "./src/env.js";

const now: DateTime = DateTime.now();

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
};
export default config;
