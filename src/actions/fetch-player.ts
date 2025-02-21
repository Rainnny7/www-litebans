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

const playerCache = new AppCache({
    ttl: 1000 * 60 * 60 * 24, // 24 hours
    checkInterval: 1000 * 60 * 60, // 1 hour
});

export const fetchPlayerData = async (
    uuid: string
): Promise<TablePlayerData | undefined> => {
    if (uuid === "CONSOLE") return undefined;

    // Check if the user is authorized
    const { userId } = await auth();
    if (!userId || !(await isAuthorized({ userId }))) {
        forbidden();
    }

    return await fetchWithCache(playerCache, `player:${uuid}`, async () => {
        try {
            const before = performance.now();
            const player: any = (
                await db
                    .select()
                    .from(historyRecords)
                    .where(eq(historyRecords.uuid, uuid))
                    .limit(1)
            )[0];

            console.log(
                `[API::fetchPlayerData] Took ${performance.now() - before}ms for ${uuid}`
            );
            return {
                uuid,
                username: player.name,
                avatar: isBedrockUuid(uuid)
                    ? STEVE_AVATAR
                    : `https://api.restfulmc.cc/player/head/${uuid}.png`,
            };
        } catch (err) {
            return undefined;
        }
    });
};
