export const STEVE_AVATAR =
    "https://api.restfulmc.cc/player/head/Steve.png?size=32";
export const CONSOLE_AVATAR =
    "https://api.restfulmc.cc/player/head/Console.png?size=32";

/**
 * Checks if a UUID is a Bedrock UUID
 *
 * @param uuid The UUID to check
 * @returns whether the UUID is a Bedrock UUID
 */
export const isBedrockUuid = (uuid: string) =>
    uuid.replace(/-/g, "").substring(0, 16) === "0".repeat(16);
