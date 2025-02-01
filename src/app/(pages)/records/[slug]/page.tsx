import {
    getPunishmentCategory,
    PunishmentCategoryInfo,
} from "~/types/punishment-category";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import RecordsTable from "~/components/records-table";

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
    return (
        <main className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold">
                {category.displayName} Records
            </h1>
            <RecordsTable category={category} />
        </main>
    );
};
export default RecordsPage;
