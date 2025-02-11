"use server";

import { desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/server/drizzle";
import { getPunishmentCategory } from "~/types/punishment-category";
import { type BasePunishmentRecord } from "~/types/punishment-record";

type FetchRecordsOptions = {
    search?: string;
};

/**
 * Fetch the records for a given category.
 *
 * @param categoryId the category to fetch records from
 * @param options filtering options
 * @returns the filtered records
 */
export const fetchRecords = async (
    categoryId: string,
    options: FetchRecordsOptions = {}
): Promise<BasePunishmentRecord[]> => {
    // Ensure the category exists first
    const category = getPunishmentCategory(categoryId);
    if (!category) {
        notFound();
    }
    // If so, build the query
    const query = db.select().from(category.table);
    if (options.search) {
        // TODO: Implement search
    }
    return (await query.orderBy(
        desc(category.table.time)
    )) as BasePunishmentRecord[];
};
