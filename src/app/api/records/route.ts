import { auth } from "@clerk/nextjs/server";
import { count, desc } from "drizzle-orm";
import { forbidden, notFound } from "next/navigation";
import { type NextRequest } from "next/server";
import { checkDiscordRole } from "~/lib/auth";
import { Paginator } from "~/lib/paginator";
import { fetchPlayerData } from "~/lib/player";
import { db } from "~/server/drizzle";
import { getPunishmentCategory } from "~/types/punishment-category";
import {
    type BasePunishmentRecord,
    type TablePunishmentRecord,
} from "~/types/punishment-record";

async function validateRequest(request: NextRequest) {
    // Get the request params
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const page = Number(searchParams.get("page") ?? "1");
    const itemsPerPage = Number(searchParams.get("itemsPerPage") ?? "10");

    // Ensure the user is authenticated
    const { userId } = await auth();
    if (!userId || !(await checkDiscordRole({ userId }))) {
        forbidden();
    }

    // Missing required params
    if (!categoryId) {
        return Response.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Ensure the category exists
    const category = getPunishmentCategory(categoryId);
    if (!category) {
        notFound();
    }

    return { categoryId, page, itemsPerPage, category };
}

async function fetchRecordsFromDatabase(
    categoryId: string,
    category: any,
    page: number,
    itemsPerPage: number
) {
    const offset = (page - 1) * itemsPerPage;

    console.log(`[API::fetchRecords] Fetching ${categoryId} records...`);
    const before = Date.now();

    const [totalCount, records] = (await Promise.all([
        db.select({ count: count() }).from(category.table),
        db
            .select()
            .from(category.table)
            .orderBy(desc(category.table.time))
            .offset(offset)
            .limit(itemsPerPage),
    ])) as [{ count: number }[], BasePunishmentRecord[]];
    const totalRecords = totalCount.at(0)?.count ?? 0;

    console.log(
        `[API::fetchRecords] Took ${Date.now() - before}ms to fetch ${records.length}/${totalRecords} records`
    );
    return { records, totalRecords };
}

async function mapPlayerData(
    records: BasePunishmentRecord[]
): Promise<TablePunishmentRecord[]> {
    console.log(
        `[API::mapPlayerData] Mapping UUID -> Minecraft Account for ${records.length} records...`
    );
    const before = Date.now();

    // Create arrays of UUIDs to fetch in parallel
    const playerUuids = records.map((record) => record.uuid);
    const staffUuids = records
        .map((record) => record.bannedByUuid)
        .filter(Boolean);

    // Fetch all player and staff data in parallel
    const [playerDataMap, staffDataMap] = await Promise.all([
        Promise.all(playerUuids.map((uuid) => fetchPlayerData(uuid))),
        Promise.all(staffUuids.map((uuid) => fetchPlayerData(uuid ?? ""))),
    ]);

    // Create lookup maps
    const playerLookup = Object.fromEntries(
        playerUuids.map((uuid, i) => [uuid, playerDataMap[i]])
    );
    const staffLookup = Object.fromEntries(
        staffUuids.map((uuid, i) => [uuid, staffDataMap[i]])
    );

    // Map the records using the lookup maps
    const mappedRecords = records.map(
        (record): TablePunishmentRecord => ({
            ...record,
            player: playerLookup[record.uuid],
            staff: record.bannedByUuid
                ? staffLookup[record.bannedByUuid]
                : undefined,
        })
    );

    console.log(
        `[API::mapPlayerData] Took ${Date.now() - before}ms to map UUID -> Minecraft Account for ${mappedRecords.length} records`
    );
    return mappedRecords;
}

export const GET = async (request: NextRequest) => {
    const before: number = Date.now();
    const validation = await validateRequest(request);
    if (validation instanceof Response) return validation;

    const { categoryId, page, itemsPerPage, category } = validation;
    const { records, totalRecords } = await fetchRecordsFromDatabase(
        categoryId,
        category,
        page,
        itemsPerPage
    );

    console.log(`[API::fetchRecords] Paginating ${records.length} records...`);

    const beforePagination: number = Date.now();
    const paginatedPage = await new Paginator<BasePunishmentRecord>()
        .setItemsPerPage(itemsPerPage)
        .setTotalItems(totalRecords)
        .getPage(page, async () => mapPlayerData(records));

    console.log(
        `[API::fetchRecords] Took ${Date.now() - beforePagination}ms to paginate ${records.length} records`
    );
    return Response.json({
        ...paginatedPage,
        time: Date.now() - before,
    });
};
