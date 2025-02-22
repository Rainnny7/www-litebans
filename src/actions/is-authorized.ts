"use server";

import { type ClerkClient } from "@clerk/backend";
import { clerkClient } from "@clerk/nextjs/server";
import { AppCache, fetchWithCache } from "~/common/cache";
import { redis } from "~/common/redis";
import { env, isDemoMode } from "~/env";

const DISCORD_ROLE_CACHE_TTL = 300; // 5 minutes
const roleMemoryCache = new AppCache({
    ttl: DISCORD_ROLE_CACHE_TTL * 1000,
    checkInterval: 1000 * 60 * 60, // 1 hour
});

/**
 * Check if a user is authorized.
 * <p>
 * This is done by checking if they
 * have the required role on Discord.
 * </p>
 *
 * @param userId the id of the user
 * @returns whether the user is authorized
 */
export const isAuthorized = async ({
    userId,
}: {
    userId: string;
}): Promise<boolean> => {
    // If we're in demo mode, always authorize the user
    if (isDemoMode) {
        return true;
    }
    const before: number = performance.now();
    console.log(
        `[Action::isAuthorized] Checking if user ${userId} is authorized...`
    );
    const roles = await fetchWithCache(
        roleMemoryCache,
        `discord-roles:${userId}`,
        async () => {
            const redisCacheKey = `www-litebans:discord-roles:${userId}`;

            // Before reaching out to Discord, check the cache.
            if (redis) {
                const cachedRoles: string[] =
                    await redis.smembers(redisCacheKey);
                if (cachedRoles && cachedRoles.length > 0) {
                    return cachedRoles;
                }
            }

            // Fetch the user's Discord roles from the API.
            const client: ClerkClient = await clerkClient();

            // Get the Discord access token for the user, if any.
            const accessTokens = await client.users.getUserOauthAccessToken(
                userId,
                "discord"
            );
            if (!accessTokens || accessTokens.totalCount < 1) {
                return [];
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
                return [];
            }
            const roles = (await membershipResponse.json()).roles;

            // Before returning the result, cache it.
            if (redis && roles && roles.length > 0) {
                const pipeline = redis.pipeline();
                for (const role of roles) {
                    pipeline.sadd(redisCacheKey, role);
                }
                pipeline.expire(redisCacheKey, DISCORD_ROLE_CACHE_TTL);
                await pipeline.exec();
            }
            return roles;
        }
    );
    console.log(
        `[Action::isAuthorized] Took ${performance.now() - before}ms to check if user ${userId} is authorized`
    );
    return roles?.includes(env.CLERK_REQUIRED_ROLE_ID);
};

// /**
//  * Check if a user is authorized.
//  * <p>
//  * This is done by checking if they
//  * have the required role on Discord.
//  * </p>
//  *
//  * @param userId the id of the user
//  * @returns whether the user is authorized
//  */
// export const isAuthorized = async ({
//     userId,
// }: {
//     userId: string;
// }): Promise<boolean> => {

//     // const cacheKey = `www-litebans:has-required-role:${userId}`;

//     // // Before reaching out to Discord, check the cache.
//     // const cachedResult: string | null = await redis.get(cacheKey);
//     // if (cachedResult) {
//     //     return `${cachedResult}` === "true";
//     // }
//     // Fetch the user's Discord roles from the API.
//     const client: ClerkClient = await clerkClient();

//     // Get the Discord access token for the user, if any.
//     const accessTokens = await client.users.getUserOauthAccessToken(
//         userId,
//         "discord"
//     );
//     if (!accessTokens || accessTokens.totalCount < 1) {
//         return false;
//     }
//     const accessToken = accessTokens.data.at(0);

//     // Get the Discord guild membership for the user.
//     const membershipResponse: Response = await fetch(
//         `https://discord.com/api/users/@me/guilds/${env.CLERK_REQUIRED_GUILD_ID}/member`,
//         {
//             headers: {
//                 Authorization: `Bearer ${accessToken?.token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );
//     if (!membershipResponse.ok) {
//         return false;
//     }

//     // Only allow the user access if they have the required role.
//     const hasRequiredRole: boolean = (
//         await membershipResponse.json()
//     ).roles.includes(env.CLERK_REQUIRED_ROLE_ID);

//     // Before returning the result, cache it.
//     // await redis.setex(cacheKey, DISCORD_ROLE_CACHE_TTL, hasRequiredRole);

//     return hasRequiredRole;
// };
