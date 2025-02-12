import { type CachedPlayer, getPlayer } from "restfulmc-lib";
import { type TablePlayerData } from "~/types/punishment-record";

export const STEVE_AVATAR = "https://api.restfulmc.cc/player/head/Steve.png";

export const fetchPlayerData = async (
    uuid: string
): Promise<TablePlayerData | undefined> => {
    if (uuid === "CONSOLE") return undefined;
    try {
        const player: CachedPlayer = await getPlayer(uuid);
        return { username: player.username, avatar: player.skin.parts.HEAD };
    } catch {
        return undefined;
    }
};
