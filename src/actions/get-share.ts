"use server";

import { notFound } from "next/navigation";
import { handleAuthCheck } from "~/common/auth";
import { redis } from "~/common/redis";
import { RecordShare } from "~/types/record-share";

/**
 * Get a share by its key from the database.
 *
 * @param key the share key
 * @returns the share if found, undefined otherwise
 */
export const getShare = async (
    key: string
): Promise<RecordShare | undefined> => {
    await handleAuthCheck(); // Ensure the user is authorized
    if (!redis) notFound();
    const before: number = performance.now();

    // Get the share from the database
    console.log(
        `[Action::getShare] Retrieving shared record with key ${key}...`
    );
    const share: string | null = await redis.get(`www-litebans:share:${key}`);
    if (!share) notFound();

    console.log(
        `[Action::getShare] Took ${performance.now() - before}ms to get share with key ${key}`
    );
    return share as any as RecordShare;
};
