import { type CachedPlayer, getPlayer } from "restfulmc-lib";
import { AppCache, fetchWithCache } from "~/lib/cache";
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
    if (uuid === "CONSOLE") return undefined;
    return await fetchWithCache(playerCache, `player:${uuid}`, async () => {
        try {
            const player: CachedPlayer = await getPlayer(uuid);
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
