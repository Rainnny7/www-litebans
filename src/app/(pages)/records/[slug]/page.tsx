import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import RecordsTable from "~/components/records-table";
import { removeObjectFields } from "~/lib/utils";
import {
    getPunishmentCategory,
    type PunishmentCategoryInfo,
} from "~/types/punishment-category";

/**
 * The records page for each {@link PunishmentCategory}.
 *
 * @param params the parameters from the URL
 * @param searchParams the search parameters from the URL
 * @returns the records page
 */
const RecordsPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: number }>;
}): Promise<ReactElement> => {
    const { slug } = await params;
    const { page = 1 } = await searchParams;

    // Get the category from the slug and ensure it exists
    const category: PunishmentCategoryInfo | undefined =
        getPunishmentCategory(slug);
    if (!category) {
        notFound();
    }
    return (
        <main>
            <RecordsTable
                category={removeObjectFields({ id: slug, ...category }, [
                    "table",
                ])}
                page={Number(page)}
            />
        </main>
    );
};
export default RecordsPage;
