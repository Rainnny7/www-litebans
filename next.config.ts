/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip
 * env validation. This is especially useful for Docker builds.
 */
import type { NextConfig } from "next";
import "./src/env.js";

const config: NextConfig = {
    output: "standalone",
    reactStrictMode: true,
    cacheMaxMemorySize: 0,
    poweredByHeader: false,
    images: { unoptimized: true },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    experimental: { reactCompiler: true },
};
export default config;
