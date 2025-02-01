import {
    getPunishmentCategory,
    type PunishmentCategoryInfo,
} from "~/types/punishment-category";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import RecordsTable from "~/components/records-table";
import { db } from "~/server/drizzle";
import { desc } from "drizzle-orm";

const RecordsPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<ReactElement> => {
    const { slug } = await params;
    const category: PunishmentCategoryInfo | undefined =
        getPunishmentCategory(slug);
    if (!category) {
        notFound();
    }
    const records: any[] = await db
        .select()
        .from(category.table)
        .orderBy(desc(category.table.time));

    return (
        <main className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold">
                {category.displayName} Records
            </h1>
            <RecordsTable records={records} />
        </main>
    );
};
export default RecordsPage;
