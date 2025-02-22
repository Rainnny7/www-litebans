"use client";

import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Info, LoaderCircle } from "lucide-react";
import { DateTime } from "luxon";
import {
    type ChangeEvent,
    cloneElement,
    type ReactElement,
    useState,
} from "react";
import { getPlayer } from "restfulmc-lib";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { type Page } from "~/common/paginator";
import { CONSOLE_AVATAR, STEVE_AVATAR } from "~/common/player";
import api from "~/common/request";
import { formatMinecraftString, truncateText } from "~/common/string";
import { numberWithCommas } from "~/common/utils";
import PaginationControls from "~/components/pagination-controls";
import PlayerAvatar from "~/components/player-avatar";
import RecordContextMenu from "~/components/record/record-context-menu";
import RecordDialog from "~/components/record/record-dialog";
import RecordSkeleton from "~/components/record/record-skeleton";
import RecordStatus from "~/components/record/record-status";
import SimpleTooltip from "~/components/simple-tooltip";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import { type PunishmentCategoryInfo } from "~/types/punishment-category";
import {
    type TablePlayerData,
    type TablePunishmentRecord,
} from "~/types/punishment-record";

const COLUMNS: ColumnDef<TablePunishmentRecord>[] = [
    {
        accessorKey: "id",
        header: "#",
        size: 45,
        enableSorting: false,
        cell: ({ row }) => (
            <div className="text-zinc-300/75">
                {numberWithCommas(row.getValue("id"))}
            </div>
        ),
    },
    {
        accessorKey: "player",
        header: "Player",
        size: 205,
        enableSorting: false,
        cell: ({ row }) => {
            const player: TablePlayerData | undefined = row.original.player;
            return (
                <div className="flex gap-3 items-center">
                    <PlayerAvatar avatar={player?.avatar ?? STEVE_AVATAR} />
                    <span className="truncate">
                        {player?.username ?? "Unknown Player"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "bannedByName",
        header: "Staff",
        size: 205,
        cell: ({ row }) => {
            const record: TablePunishmentRecord = row.original;
            const staff: TablePlayerData | undefined = row.original.staff;
            return (
                <div className="flex gap-3 items-center">
                    <PlayerAvatar
                        avatar={
                            record.bannedByUuid === "CONSOLE"
                                ? CONSOLE_AVATAR
                                : (staff?.avatar ?? STEVE_AVATAR)
                        }
                    />
                    <span className="truncate">
                        {staff?.username ?? record.bannedByName}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "reason",
        header: "Reason",
        size: 250,
        enableSorting: false,
        cell: ({ row }) => {
            const reason: string = row.original.reason;
            const colorReason = (truncate: boolean) =>
                reason
                    ? formatMinecraftString(
                          truncate ? truncateText(reason, 32) : reason
                      )
                    : "No reason specified";
            return (
                <div className="max-h-12 overflow-hidden">
                    <SimpleTooltip content={<span>{colorReason(false)}</span>}>
                        <div className="w-fit truncate">
                            {colorReason(true)}
                        </div>
                    </SimpleTooltip>
                </div>
            );
        },
    },
    {
        accessorKey: "issued",
        header: "Issued",
        size: 110,
        enableSorting: false,
        cell: ({ row }) => {
            const issued: DateTime = DateTime.fromMillis(row.original.time);
            return (
                <SimpleTooltip
                    content={issued.toLocaleString(DateTime.DATETIME_MED)}
                >
                    <div className="min-w-[6.5rem] w-fit">
                        {issued.toRelative()}
                    </div>
                </SimpleTooltip>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 20,
        enableSorting: false,
        cell: ({ row }) => <RecordStatus status={row.original.status} />,
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        size: 20,
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <SimpleTooltip content="More Info">
                    <div className="flex items-center">
                        <RecordDialog record={row.original}>
                            <Button
                                className="size-4 cursor-pointer"
                                variant="ghost"
                                size="icon"
                            >
                                <Info className="size-2.5 text-muted-foreground hover:text-foreground transition-all transform-gpu" />
                            </Button>
                        </RecordDialog>
                    </div>
                </SimpleTooltip>
            </div>
        ),
    },
];
const DEBOUNCE_TIME = 500;

const RecordsTable = ({
    category,
    search: initialSearch,
    page: initialPage,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder,
}: {
    category: PunishmentCategoryInfo & { id: string };
    search: string;
    page: number;
    sortBy: string;
    sortOrder: string;
}): ReactElement => {
    // State management
    const [search, setSearch] = useState<string>(initialSearch);
    const [debouncedSearch, setDebouncedSearch] =
        useState<string>(initialSearch);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(initialPage);
    const [sorting, setSorting] = useState<SortingState>([
        { id: initialSortBy, desc: initialSortOrder === "desc" },
    ]);

    // Update the current URL params
    const updateUrlParams = (
        page: number,
        search: string | undefined,
        sort?: SortingState
    ) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        if (search) {
            params.set("query", search);
        }
        if (sort?.[0]?.id) {
            params.set("sortBy", sort[0].id);
            params.set("sortOrder", sort[0].desc ? "desc" : "asc");
        }
        const url = `?${params.toString()}`;
        window.history.replaceState({ page: url }, "", url);
    };

    // Debounce the search value
    const debouncedSetSearch = useDebouncedCallback((value: string) => {
        setDebouncedSearch(value);
        handlePageChange(1);
        updateUrlParams(1, value, sorting);
    }, DEBOUNCE_TIME);

    // Update the URL params when page changes
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrlParams(newPage, debouncedSearch, sorting); // Update the state in the URL
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll back to the top
    };

    // Fetch the records based on current page, search, and sorting
    const {
        data: records,
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: [
            "records",
            category.id,
            page,
            itemsPerPage,
            debouncedSearch,
            sorting,
        ],
        queryFn: async () => {
            try {
                return await api.get<
                    Page<TablePunishmentRecord> & { time: number }
                >("/api/records", {
                    searchParams: {
                        category: category.id,
                        page,
                        itemsPerPage,
                        search: debouncedSearch,
                        ...(sorting?.[0]?.id
                            ? {
                                  sortBy: sorting[0].id,
                                  sortOrder: sorting[0].desc ? "desc" : "asc",
                              }
                            : {}),
                    },
                });
            } catch (error) {
                // If there is an error whilst fetching records, handle it and inform the user
                const cause: string = (error as any).cause.data.error;
                let unknown: boolean = true;
                if (cause === "ECONNRESET") {
                    error = new Error(cause);
                    unknown = false;
                }
                toast.error(`Failed to fetch ${category.id} records`, {
                    id: "records-fetch-error",
                    description: unknown ? "An unknown error occurred" : cause,
                });
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });

    const loading: boolean = isLoading || isFetching;
    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <h1 className="flex items-center gap-2 text-xl font-bold">
                {cloneElement(category.icon, {
                    className: "size-5",
                })}
                {category.displayName} Records
            </h1>

            {/* Filters */}
            <div className="flex justify-between items-center">
                <SearchInput
                    value={search}
                    onChange={(value: string) => {
                        setSearch(value);
                        debouncedSetSearch(value);
                    }}
                />
            </div>

            {/* Records Table */}
            <div className="flex flex-col gap-1.5">
                <div className="relative rounded-lg border border-muted">
                    <div className="overflow-x-auto">
                        <div className="bg-muted/25 min-w-[800px]">
                            <DataTable
                                columns={COLUMNS}
                                data={records?.items ?? []}
                                loading={loading}
                                rowsPerPage={itemsPerPage}
                                skeletonRow={<RecordSkeleton />}
                                contextMenu={(row) => (
                                    <RecordContextMenu record={row.original} />
                                )}
                                noResultsMessage={
                                    error
                                        ? "Failed to load records"
                                        : "No records were found matching your query."
                                }
                                sorting={sorting}
                                onSortingChange={(newSorting) => {
                                    setSorting(newSorting);
                                    updateUrlParams(
                                        page,
                                        debouncedSearch,
                                        newSorting
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {!error && (
                    <PaginationControls
                        responseTime={records?.time ?? 0}
                        page={records}
                        loading={loading}
                        rowsPerPage={itemsPerPage}
                        setPage={handlePageChange}
                        onRowsPerPageChange={(value: string) => {
                            setItemsPerPage(parseInt(value));
                            handlePageChange(1);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const SearchInput = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}): ReactElement => {
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedAvatarLookup = useDebouncedCallback(
        async (username: string) => {
            if (!username) {
                setAvatar(undefined);
            } else {
                try {
                    setAvatar((await getPlayer(username)).skin.parts.HEAD);
                } catch (error) {
                    setAvatar(undefined);
                }
            }
            setIsLoading(false);
        },
        DEBOUNCE_TIME
    );

    return (
        <div className="relative">
            <Input
                className="pl-9 w-[20.7rem]"
                placeholder="Search..."
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value: string = event.target.value;
                    setIsLoading(true);
                    onChange(value);
                    void debouncedAvatarLookup(value);
                }}
            />
            <PlayerAvatar
                className="absolute left-2.5 top-1/2 size-5 transform -translate-y-1/2"
                avatar={avatar}
            />
            {isLoading ? (
                <LoaderCircle className="absolute right-2.5 top-1/2 size-4 text-muted-foreground transform -translate-y-1/2 animate-spin" />
            ) : null}
        </div>
    );
};

export default RecordsTable;
