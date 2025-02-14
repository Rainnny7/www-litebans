import { type Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { removeObjectFields } from "~/common/utils";
import RecordsTable from "~/components/record/records-table";
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
    searchParams: Promise<{
        page?: number;
        query?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}): Promise<ReactElement> => {
    const { slug } = await params;
    const {
        page = 1,
        query = "",
        sortBy = "",
        sortOrder = "",
    } = await searchParams;

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
                search={query}
                sortBy={sortBy}
                sortOrder={sortOrder}
            />
        </main>
    );
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> => {
    const { slug } = await params;
    if (slug) {
        const category: PunishmentCategoryInfo | undefined =
            getPunishmentCategory(slug);
        if (!category) return undefined;
        return {
            title: `${category.displayName} Records`,
            description: `View the ${category.displayName} records.`,
        };
    }
};

export default RecordsPage;
