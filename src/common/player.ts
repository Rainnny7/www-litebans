import { type CachedPlayer, getPlayer } from "restfulmc-lib";
// import { type CachedPlayer, getPlayer } from "mcutils-library";
import { AppCache, fetchWithCache } from "~/common/cache";
import { type TablePlayerData } from "~/types/punishment-record";

export const STEVE_AVATAR = "https://api.restfulmc.cc/player/head/Steve.png";
export const CONSOLE_AVATAR =
    "https://api.restfulmc.cc/player/head/Console.png";

const playerCache = new AppCache({
    ttl: 1000 * 60 * 60 * 24, // 24 hours
    checkInterval: 1000 * 60 * 60, // 1 hour
});

export const fetchPlayerData = async (
    uuid: string
): Promise<TablePlayerData | undefined> => {
    if (uuid === "CONSOLE" || isBedrockUuid(uuid)) return undefined;
    return await fetchWithCache(playerCache, `player:${uuid}`, async () => {
        try {
            const before = Date.now();
            const player: CachedPlayer = await getPlayer(uuid);
            const after = Date.now();
            console.log(
                `[API::fetchPlayerData] Took ${after - before}ms for ${uuid}`
            );
            return {
                uuid: player.uniqueId,
                username: player.username,
                avatar: player.skin.parts.HEAD,
            };
        } catch (err) {
            return undefined;
        }
    });
};

/**
 * Checks if a UUID is a Bedrock UUID
 *
 * @param uuid The UUID to check
 * @returns whether the UUID is a Bedrock UUID
 */
const isBedrockUuid = (uuid: string) =>
    uuid.replace(/-/g, "").substring(0, 16) === "0".repeat(16);
