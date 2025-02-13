"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { type ChangeEvent, type ReactElement, useState } from "react";
import { getPlayer } from "restfulmc-lib";
import { useDebouncedCallback } from "use-debounce";
import PaginationControls from "~/components/pagination-controls";
import PlayerAvatar from "~/components/player-avatar";
import RecordRow from "~/components/record/record-row";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { type Page } from "~/lib/paginator";
import api from "~/lib/request";
import { type PunishmentCategoryInfo } from "~/types/punishment-category";
import {
    type BasePunishmentRecord,
    type TablePunishmentRecord,
} from "~/types/punishment-record";

const DEBOUNCE_TIME = 500;

const RecordsTable = ({
    category,
    search: initialSearch,
    page: initialPage,
}: {
    category: PunishmentCategoryInfo & { id: string };
    search: string;
    page: number;
}): ReactElement => {
    // State management
    const [search, setSearch] = useState<string>(initialSearch);
    const [debouncedSearch, setDebouncedSearch] =
        useState<string>(initialSearch);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(initialPage);

    // Update the current URL params
    const updateUrlParams = (page: number, search: string | undefined) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        if (search) {
            params.set("query", search);
        }
        const url = `?${params.toString()}`;
        window.history.replaceState({ page: url }, "", url);
    };

    // Debounce the search value
    const debouncedSetSearch = useDebouncedCallback((value: string) => {
        setDebouncedSearch(value);
        handlePageChange(1);
        updateUrlParams(1, value);
    }, DEBOUNCE_TIME);

    // Update the URL params when page changes
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrlParams(newPage, debouncedSearch);
    };

    // Fetch the records based on the current page and debounced search query
    const {
        data: records,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["records", category.id, page, itemsPerPage, debouncedSearch],
        queryFn: async () =>
            await api.get<Page<BasePunishmentRecord>>("/api/records", {
                searchParams: {
                    category: category.id,
                    page,
                    itemsPerPage,
                    search: debouncedSearch,
                },
            }),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });

    // Render the table
    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <h1 className="text-xl font-bold">
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
                {/* Table with horizontal scroll */}
                <div className="relative rounded-lg border border-muted">
                    <div className="overflow-x-auto">
                        <div className="bg-muted/25 min-w-[800px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden md:table-cell w-14">
                                            #
                                        </TableHead>
                                        <TableHead className="w-60">
                                            Player
                                        </TableHead>
                                        <TableHead className="w-60">
                                            Staff
                                        </TableHead>
                                        <TableHead className="w-96">
                                            Reason
                                        </TableHead>
                                        <TableHead className="w-40">
                                            Issued
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading || isFetching
                                        ? [...Array(itemsPerPage)].map(
                                              (_, i) => (
                                                  <SkeletonRow
                                                      key={i}
                                                      opacity={
                                                          1 -
                                                          (i / itemsPerPage) *
                                                              0.9
                                                      }
                                                  />
                                              )
                                          )
                                        : records?.items.map(
                                              (
                                                  record: TablePunishmentRecord
                                              ) => (
                                                  <RecordRow
                                                      key={record.id}
                                                      record={record}
                                                  />
                                              )
                                          )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <PaginationControls
                    page={records}
                    setPage={handlePageChange}
                    rowsPerPage={itemsPerPage}
                    onRowsPerPageChange={(value: string) => {
                        setItemsPerPage(parseInt(value));
                        handlePageChange(1);
                    }}
                />
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

const SkeletonRow = ({ opacity = 1 }: { opacity?: number }): ReactElement => (
    <TableRow style={{ opacity }}>
        <TableCell className="hidden md:table-cell text-zinc-300/75">
            <Skeleton className="w-8 h-4" />
        </TableCell>
        <TableCell>
            <div className="flex gap-3 items-center">
                <Skeleton className="w-[22px] h-[22px] rounded-sm" />
                <Skeleton className="w-24 h-4" />
            </div>
        </TableCell>
        <TableCell>
            <div className="flex gap-3 items-center">
                <Skeleton className="w-[22px] h-[22px] rounded-sm" />
                <Skeleton className="w-24 h-4" />
            </div>
        </TableCell>
        <TableCell className="max-h-6 overflow-hidden">
            <Skeleton className="w-48 h-4" />
        </TableCell>
        <TableCell>
            <Skeleton className="w-16 h-4" />
        </TableCell>
    </TableRow>
);

export default RecordsTable;
