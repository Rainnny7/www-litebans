import { createEnv } from "@t3-oss/env-nextjs";
import { DateTime } from "luxon";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),

        // Clerk
        CLERK_SECRET_KEY: z.string(),
        CLERK_REQUIRED_GUILD_ID: z.string(),
        CLERK_REQUIRED_ROLE_ID: z.string(),

        // Drizzle
        DRIZZLE_DATABASE_URL: z.string(),

        // Redis
        UPSTASH_REDIS_REST_URL: z.string(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),
    },

    client: {
        // App
        NEXT_PUBLIC_APP_NAME: z.string(),
        NEXT_PUBLIC_APP_DESCRIPTION: z.string(),
        NEXT_PUBLIC_APP_LOGO: z.string(),
        NEXT_PUBLIC_BUILD_ID: z.string(),
        NEXT_PUBLIC_BUILD_TIME: z.string(),

        // Clerk
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    },

    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,

        // App
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
        NEXT_PUBLIC_APP_LOGO: process.env.NEXT_PUBLIC_APP_LOGO,
        NEXT_PUBLIC_BUILD_ID: "test",
        NEXT_PUBLIC_BUILD_TIME: DateTime.now().toLocaleString(
            DateTime.DATETIME_SHORT
        ),

        // Clerk
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        CLERK_REQUIRED_GUILD_ID: process.env.CLERK_REQUIRED_GUILD_ID,
        CLERK_REQUIRED_ROLE_ID: process.env.CLERK_REQUIRED_ROLE_ID,

        // Drizzle
        DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,

        // Redis
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    },

    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip
     * env validation. This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    /**
     * Makes it so that empty strings are treated as undefined.
     * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});

export const isProd = env.NODE_ENV === "production";
