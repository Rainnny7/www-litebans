import { auth } from "@clerk/nextjs/server";
import { asc, count, desc, eq, or } from "drizzle-orm";
import { forbidden, notFound } from "next/navigation";
import { type NextRequest } from "next/server";
import { checkDiscordRole } from "~/common/auth";
import { Paginator } from "~/common/paginator";
import { fetchPlayerData } from "~/common/player";
import { db } from "~/server/drizzle";
import { trackRecordFetch } from "~/server/umami";
import { getPunishmentCategory } from "~/types/punishment-category";
import {
    type BasePunishmentRecord,
    type TablePunishmentRecord,
} from "~/types/punishment-record";

async function validateRequest(request: NextRequest) {
    // Get the request params
    const { searchParams } = new URL(request.url);
    const categoryId: string | null = searchParams.get("category");
    const page: number = Number(searchParams.get("page") ?? "1");
    const itemsPerPage: number = Number(
        searchParams.get("itemsPerPage") ?? "10"
    );
    const search: string | null = searchParams.get("search");
    const sortBy: string | null = searchParams.get("sortBy");
    const sortOrder: string | null = searchParams.get("sortOrder");

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

    return {
        categoryId,
        page,
        itemsPerPage,
        category,
        search,
        sortBy,
        sortOrder,
    };
}

async function fetchRecordsFromDatabase(
    categoryId: string,
    category: any,
    page: number,
    itemsPerPage: number,
    search: string | null,
    sortBy: string | null,
    sortOrder: string | null
) {
    console.log(`[API::fetchRecords] Fetching ${categoryId} records...`);
    const before: number = Date.now();

    // If the search query is a username
    if (search && search.length <= 16) {
        const player = await fetchPlayerData(search);
        if (player) {
            search = player.uuid;
        }
    }

    // Build the search query
    const searchQuery = search
        ? or(
              eq(category.table.uuid, search),
              eq(category.table.bannedByUuid, search)
          )
        : undefined;

    // Build the base query
    let query: any = db.select().from(category.table).where(searchQuery);

    // Apply sorting if specified
    if (sortBy && sortOrder) {
        const orderFunc = sortOrder === "desc" ? desc : asc;
        query = query.orderBy(
            orderFunc(category.table[sortBy as keyof typeof category.table])
        );
    } else {
        // Default sorting
        query = query.orderBy(desc(category.table.time));
    }

    const [totalCount, records] = (await Promise.all([
        db.select({ count: count() }).from(category.table).where(searchQuery),
        query.offset((page - 1) * itemsPerPage).limit(itemsPerPage),
    ])) as [{ count: number }[], BasePunishmentRecord[]];
    const totalRecords = totalCount.at(0)?.count ?? 0;

    console.log(
        `[API::fetchRecords] Took ${Date.now() - before}ms to fetch ${records.length}/${totalRecords} records`
    );

    // Track analytics event
    trackRecordFetch(category.displayName);

    return { records, totalRecords };
}

async function mapPlayerData(
    records: BasePunishmentRecord[]
): Promise<TablePunishmentRecord[]> {
    console.log(
        `[API::fetchRecords] Mapping UUID -> Minecraft Account for ${records.length} records...`
    );
    const before = Date.now();

    // Create arrays of unique UUIDs to fetch in parallel
    const uniqueUuids = new Set([
        ...records.map((record) => record.uuid),
        ...records.map((record) => record.bannedByUuid).filter(Boolean),
    ]);

    // Fetch all player data in parallel
    const playerDataResults = await Promise.all(
        Array.from(uniqueUuids)
            .filter((uuid) => uuid !== null)
            .map((uuid) => fetchPlayerData(uuid))
    );

    // Create a single lookup map for all UUIDs
    const uuidLookup = Object.fromEntries(
        Array.from(uniqueUuids).map((uuid, i) => [uuid, playerDataResults[i]])
    );

    // Map the records using the lookup map
    const mappedRecords = records.map(
        (record): TablePunishmentRecord => ({
            ...record,
            player: uuidLookup[record.uuid],
            staff: record.bannedByUuid
                ? uuidLookup[record.bannedByUuid]
                : undefined,
        })
    );

    console.log(
        `[API::fetchRecords] Took ${Date.now() - before}ms to map UUID -> Minecraft Account for ${mappedRecords.length} records`
    );
    return mappedRecords;
}

export const GET = async (request: NextRequest) => {
    const before: number = Date.now();
    const validation = await validateRequest(request);
    if (validation instanceof Response) return validation;

    const {
        categoryId,
        page,
        itemsPerPage,
        category,
        search,
        sortBy,
        sortOrder,
    } = validation;
    try {
        // throw an sql error on purpose
        const { records, totalRecords } = await fetchRecordsFromDatabase(
            categoryId,
            category,
            page,
            itemsPerPage,
            search,
            sortBy,
            sortOrder
        );
        const paginatedPage = await new Paginator<BasePunishmentRecord>()
            .setItemsPerPage(itemsPerPage)
            .setTotalItems(totalRecords)
            .getPage(page, async () => mapPlayerData(records));

        const time: number = Date.now() - before;
        console.log(
            `[API::fetchRecords] Total time spent was ${time}ms fetching records`
        );
        return Response.json({
            ...paginatedPage,
            time,
        });
    } catch (error) {
        // Handle specific errors
        const code: string = (error as any).code;
        if (code === "ECONNRESET") {
            return Response.json({ error: code }, { status: 500 });
        }
        // Handle all other errors
        console.error("Failed to fetch records:", error);
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
