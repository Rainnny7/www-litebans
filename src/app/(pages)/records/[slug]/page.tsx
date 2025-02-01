import { getPunishmentCategory } from "~/types/punishment-category";
import { notFound } from "next/navigation";
import { db } from "~/server/drizzle";

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
    const records: any[] = await db.select().from(category.table).limit(50);
    console.log({ records });

    return (
        <main>
            <h1 className="text-3xl font-bold">
                {category.displayName} Records
            </h1>
        </main>
    );
};
export default RecordsPage;
