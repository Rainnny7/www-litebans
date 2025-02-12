import { type ClerkClient } from "@clerk/backend";
import { clerkClient } from "@clerk/nextjs/server";
import { env } from "~/env";
import { redis } from "~/server/redis";

const DISCORD_ROLE_CACHE_TTL = 300; // 5 minutes

export const checkDiscordRole = async ({
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
        "discord"
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
