/**
 * Get the player avatar URL for a given query.
 *
 * @param query the query to get the avatar for
 * @returns the avatar URL
 */
export const getPlayerAvatarUrl = (query: string) =>
    `https://api.restfulmc.cc/player/head/${query}.png?size=32`;

export const STEVE_AVATAR = getPlayerAvatarUrl("Steve");
export const CONSOLE_AVATAR = getPlayerAvatarUrl("Console");

/**
 * Checks if a UUID is a Bedrock UUID
 *
 * @param uuid The UUID to check
 * @returns whether the UUID is a Bedrock UUID
 */
export const isBedrockUuid = (uuid: string) =>
    uuid.replace(/-/g, "").substring(0, 16) === "0".repeat(16);
