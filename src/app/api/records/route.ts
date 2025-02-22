import { auth } from "@clerk/nextjs/server";
import { asc, count, desc, eq, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import { type NextRequest } from "next/server";
import { fetchPlayerData } from "~/actions/fetch-player";
import { isAuthorized } from "~/actions/is-authorized";
import { handleAuthCheck } from "~/common/auth";
import { db } from "~/common/drizzle";
import { Paginator } from "~/common/paginator";
import { trackRecordFetch } from "~/common/umami";
import { removeObjectFields } from "~/common/utils";
import {
    getPunishmentCategory,
    type PunishmentCategoryInfo,
} from "~/types/punishment-category";
import {
    type BasePunishmentRecord,
    type TablePunishmentRecord,
} from "~/types/punishment-record";

/**
 * Validate the request.
 * <p>
 * This will ensure the user is authenticated
 * and the required params are present. If the
 * request is valid, the data aquired from the
 * request will be returned so it can be used
 * in the handler.
 * </p>
 *
 * @param request the request to validate
 * @returns the error response, or request data
 */
async function validateRequest(request: NextRequest) {
    await handleAuthCheck(); // Ensure the user is authorized

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

    // Request is valid, return the data
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

/**
 * Fetch records from the database based on the given params.
 *
 * @param categoryId the category ID
 * @param category the category info
 * @param page the page number
 * @param itemsPerPage the number of items per page
 * @param search the search query, if any
 * @param sortBy the sort by field, if any
 * @param sortOrder the sort order, if any
 * @returns the records and total records
 */
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
    const before: number = performance.now();

    // If the search query is a username, map it to a UUID
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

    // Apply sorting of a field if specified
    if (sortBy && sortOrder) {
        const orderFunc = sortOrder === "desc" ? desc : asc;
        query = query.orderBy(
            orderFunc(category.table[sortBy as keyof typeof category.table])
        );
    } else {
        // Default sorting (by time issued)
        query = query.orderBy(desc(category.table.time));
    }

    // Finally, execute the query and fetch the total record
    // count, as well as the records for the given page
    const [totalCount, records] = (await Promise.all([
        db.select({ count: count() }).from(category.table).where(searchQuery),
        query.offset((page - 1) * itemsPerPage).limit(itemsPerPage),
    ])) as [{ count: number }[], BasePunishmentRecord[]];
    const totalRecords = totalCount.at(0)?.count ?? 0;

    console.log(
        `[API::fetchRecords] Took ${performance.now() - before}ms to fetch ${records.length}/${totalRecords} records`
    );
    trackRecordFetch(category.displayName); // Track analytics event
    return { records, totalRecords };
}

/**
 * Map UUIDs in the given records to player data, which
 * is the player's actual username, and skin avatars.
 *
 * @param category the category info
 * @param records the records to map
 * @returns the mapped records
 */
async function mapPlayerData(
    category: PunishmentCategoryInfo,
    records: BasePunishmentRecord[]
): Promise<TablePunishmentRecord[]> {
    console.log(
        `[API::fetchRecords] Mapping UUID -> Minecraft Account for ${records.length} records...`
    );
    const before = performance.now();

    // Create arrays of unique UUIDs to fetch in parallel
    const uniqueUuids = new Set([
        ...records.map((record) => record.uuid),
        ...records.map((record) => record.bannedByUuid).filter(Boolean), // Filter out null values
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
    const mappedRecords = records.map((record): TablePunishmentRecord => {
        const permanent: boolean = record.until <= 0;
        return {
            ...record,
            category: removeObjectFields(category, ["table"]),
            status:
                !record.removedByUuid &&
                (permanent || record.until > Date.now())
                    ? "active"
                    : record.removedByUuid
                      ? "removed"
                      : "expired",
            permanent,
            player: uuidLookup[record.uuid],
            staff: record.bannedByUuid
                ? uuidLookup[record.bannedByUuid]
                : undefined,
        };
    });
    console.log(
        `[API::fetchRecords] Took ${performance.now() - before}ms to map UUID -> Minecraft Account for ${mappedRecords.length} records`
    );
    return mappedRecords;
}

/**
 * Handle the GET route to fetch records.
 *
 * @param request the request to handle
 * @returns the response
 */
export const GET = async (request: NextRequest) => {
    // First validate the request and early return if it fails
    const before: number = performance.now();
    const validation = await validateRequest(request);
    if (validation instanceof Response) return validation;

    // Otherwise continue with the request
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
        // Fetch the records from the database based on the given
        // params, paginate them, map the player data, and return
        // the response
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
            .getPage(page, async () => mapPlayerData(category, records));

        return Response.json({
            ...paginatedPage,
            time: performance.now() - before,
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
    } finally {
        console.log(
            `[API::fetchRecords] Total time spent was ${performance.now() - before}ms fetching records`
        );
    }
};
