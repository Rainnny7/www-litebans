"use server";

import superjson from "superjson";
import { handleAuthCheck } from "~/common/auth";
import { redis } from "~/common/redis";
import { generateRandom } from "~/common/string";
import { PunishmentType } from "~/types/punishment-category";
import { TablePunishmentRecord } from "~/types/punishment-record";
import { RecordShare } from "~/types/record-share";

export const shareRecord = async (
    form: FormData,
    record: TablePunishmentRecord
): Promise<RecordShare> => {
    const { userId } = await handleAuthCheck(); // Ensure the user is authorized
    const isProtected: boolean = form.get("protected") === "on";
    const before: number = performance.now();
    const categoryId: PunishmentType =
        record.category.displayName.toLowerCase() as PunishmentType;
    console.log(
        `[Action::shareRecord] Creating a shared record for ${categoryId} #${record.id}...`
    );

    // Create the share
    const share: RecordShare = {
        key: generateRandom(16),
        category: categoryId,
        record: record.id,
        protected: isProtected,
        creator: userId,
    };
    if (redis) {
        await redis.setex(
            `www-litebans:share:${share.key}`,
            60 * 60, // 1 hour
            superjson.stringify(share)
        );
    }
    console.log(
        `[Action::shareRecord] Done, created record share ${share.key} for ${categoryId} #${record.id} in ${performance.now() - before}ms`
    );
    return share;
};
