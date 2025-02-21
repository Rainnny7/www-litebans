"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { forbidden } from "next/navigation";
import { isAuthorized } from "~/actions/is-authorized";
import { AppCache, fetchWithCache } from "~/common/cache";
import { db } from "~/common/drizzle";
import { historyRecords } from "~/common/drizzle/schema";
import { isBedrockUuid, STEVE_AVATAR } from "~/common/player";
import { type TablePlayerData } from "~/types/punishment-record";

/**
 * An in-memory cache for player data.
 */
const playerCache = new AppCache({
    ttl: 1000 * 60 * 60 * 24, // 24 hours
    checkInterval: 1000 * 60 * 60, // 1 hour
});

/**
 * Fetch player data from the database with the given query.
 *
 * @param query the query to fetch data for, uuid or username
 * @returns the player data if found, undefined otherwise
 */
export const fetchPlayerData = async (
    query: string
): Promise<TablePlayerData | undefined> => {
    const isUuid: boolean = query.length === 36;
    if (query === "CONSOLE") return undefined;

    // Check if the user is authorized
    const { userId } = await auth();
    if (!userId || !(await isAuthorized({ userId }))) {
        forbidden();
    }

    return await fetchWithCache(playerCache, `player:${query}`, async () => {
        try {
            const before = performance.now();
            const player: any = (
                await db
                    .select()
                    .from(historyRecords)
                    .where(
                        eq(
                            isUuid ? historyRecords.uuid : historyRecords.name,
                            query
                        )
                    )
                    .limit(1)
            )[0];

            console.log(
                `[API::fetchPlayerData] Took ${performance.now() - before}ms for ${query}`
            );
            return {
                uuid: player.uuid,
                username: player.name,
                avatar:
                    isUuid && isBedrockUuid(query)
                        ? STEVE_AVATAR
                        : `https://api.restfulmc.cc/player/head/${query}.png`,
            };
        } catch (err) {
            return undefined;
        }
    });
};
