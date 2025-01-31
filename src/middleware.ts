import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import {
    clerkClient,
    clerkMiddleware,
    createRouteMatcher,
} from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ClerkClient } from "@clerk/backend";
import { env } from "~/env";
import { redis } from "~/server/redis";

const DISCORD_ROLE_CACHE_TTL = 300; // 5 minutes
const isForbiddenRoute = createRouteMatcher(["/forbidden"]);

export default clerkMiddleware(
    async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
        // Simply allow all routes to pass through for /forbidden.
        if (isForbiddenRoute(req)) {
            return NextResponse.next();
        }

        // If there is no userId, protect the route.
        const { userId } = await auth();
        if (!userId) {
            await auth.protect();
            return;
        }
        // Otherwise, get the user from the Clerk client and
        // check to see if they have the allowed role in Discord.
        if (!(await checkDiscordRole({ userId }))) {
            return NextResponse.redirect(new URL("/forbidden", req.url));
        }
    }
);

const checkDiscordRole = async ({
    userId,
}: {
    userId: string;
}): Promise<boolean> => {
    const cacheKey = `www-litebans:has-required-role:${userId}`;

    // Before reaching out to Discord, check the cache.
    const cachedResult: string | null = await redis.get(cacheKey);
    if (cachedResult) {
        return `${cachedResult}` === "true";
    }
    // Fetch the user's Discord roles from the API.
    const client: ClerkClient = await clerkClient();

    // Get the Discord access token for the user, if any.
    const accessTokens = await client.users.getUserOauthAccessToken(
        userId,
        "oauth_discord"
    );
    if (!accessTokens || accessTokens.totalCount < 1) {
        return false;
    }
    const accessToken = accessTokens.data.at(0);

    // Get the Discord guild membership for the user.
    const membershipResponse: Response = await fetch(
        `https://discord.com/api/users/@me/guilds/${env.CLERK_REQUIRED_GUILD_ID}/member`,
        {
            headers: {
                Authorization: `Bearer ${accessToken?.token}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!membershipResponse.ok) {
        return false;
    }

    // Only allow the user access if they have the required role.
    const hasRequiredRole: boolean = (
        await membershipResponse.json()
    ).roles.includes(env.CLERK_REQUIRED_ROLE_ID);

    // Before returning the result, cache it.
    await redis.setex(cacheKey, DISCORD_ROLE_CACHE_TTL, hasRequiredRole);

    return hasRequiredRole;
};

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
