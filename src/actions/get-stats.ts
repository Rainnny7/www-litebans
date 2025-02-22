"use server";

import { count } from "drizzle-orm";
import { handleAuthCheck } from "~/common/auth";
import { db } from "~/common/drizzle";
import { historyRecords } from "~/common/drizzle/schema";
import { InstanceStats } from "~/types/instance-stat";
import {
    PUNISHMENT_CATEGORIES,
    PUNISHMENT_TYPES,
    PunishmentCategoryInfo,
    PunishmentType,
} from "~/types/punishment-category";

/**
 * Get the stats for the currently
 * connected LiteBans instance.
 *
 * @returns the instance stats
 */
export const getStats = async (): Promise<InstanceStats> => {
    await handleAuthCheck(); // Ensure the user is authorized

    // Get the total number of unique players that have joined the server
    const uniquePlayers: number =
        (await db.select({ count: count() }).from(historyRecords)).at(0)
            ?.count ?? 0;

    // Obtain the total number of records for each category
    const values: number[] = await Promise.all(
        Object.values(PUNISHMENT_CATEGORIES).map(
            async (category: PunishmentCategoryInfo) =>
                (await db.select({ count: count() }).from(category.table)).at(0)
                    ?.count ?? 0
        )
    );
    const categoryStats: Record<PunishmentType, number> =
        PUNISHMENT_TYPES.reduce(
            (acc, type, i) => ({ ...acc, [type]: values[i] }),
            {} as { [key in PunishmentType]: number }
        );

    return {
        uniquePlayers,
        categoryStats,
    };
};
