"use server";

import { auth } from "@clerk/nextjs/server";
import { count, desc } from "drizzle-orm";
import { forbidden, notFound } from "next/navigation";
import { checkDiscordRole } from "~/lib/auth";
import { db } from "~/server/drizzle";
import { getPunishmentCategory } from "~/types/punishment-category";
import { type BasePunishmentRecord } from "~/types/punishment-record";

type FetchRecordsOptions = { search?: string; offset: number; limit: number };
export type FetchRecordsResponse = {
    records: BasePunishmentRecord[];
    total: number;
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
    options: FetchRecordsOptions
): Promise<FetchRecordsResponse> => {
    const { userId } = await auth();
    if (!userId || !(await checkDiscordRole({ userId }))) {
        forbidden();
    }

    // Ensure the category exists first
    const category = getPunishmentCategory(categoryId);
    if (!category) {
        notFound();
    }

    // Fetch the total count and the records
    const before: number = Date.now();
    const [totalCount, records] = await Promise.all([
        db.select({ count: count() }).from(category.table),
        db
            .select()
            .from(category.table)
            .orderBy(desc(category.table.time))
            .offset(options.offset)
            .limit(options.limit),
    ]);
    const totalRecords: number = totalCount.at(0)?.count ?? 0;

    console.log(
        `Took ${Date.now() - before}ms to fetch ${totalRecords} records`
    );

    return { records: records as BasePunishmentRecord[], total: totalRecords };
};
