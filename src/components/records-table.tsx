"use client";

import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type ReactElement, useState } from "react";
import { getPlayer } from "restfulmc-lib";
import { useDebouncedCallback } from "use-debounce";
import PaginationControls from "~/components/pagination-controls";
import SimpleTooltip from "~/components/simple-tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
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
import { STEVE_AVATAR } from "~/lib/player";
import api from "~/lib/request";
import { formatMinecraftString, truncateText } from "~/lib/string";
import { cn, numberWithCommas } from "~/lib/utils";
import { type PunishmentCategoryInfo } from "~/types/punishment-category";
import {
    type BasePunishmentRecord,
    type TablePunishmentRecord,
} from "~/types/punishment-record";

const RecordsTable = ({
    category,
    page: initialPage,
}: {
    category: PunishmentCategoryInfo & { id: string };
    page: number;
}): ReactElement => {
    const router = useRouter();

    // State management
    const [search, setSearch] = useState<string>("");
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(initialPage);

    // Update the URL params when page changes
    const handlePageChange = (newPage: number) => {
        setPage(newPage);

        // Push new state and URL to history
        window.history.replaceState(
            { page: `?page=${newPage}` },
            "",
            `?page=${newPage}`
        );
    };

    // Fetch the records based on the current page and search query
    const {
        data: records,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["records", category.id, page, itemsPerPage, search],
        queryFn: async () =>
            await api.get<Page<BasePunishmentRecord>>("/api/records", {
                searchParams: {
                    category: category.id,
                    page,
                    itemsPerPage,
                    search,
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
                <SearchInput value={search} onChange={setSearch} />
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
        },
        300
    );

    return (
        <div className="relative">
            <Input
                className="pl-9 w-[20.7rem]"
                placeholder="Search..."
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value: string = event.target.value;
                    onChange(value);
                    void debouncedAvatarLookup(value);
                }}
            />
            <PlayerAvatar
                className="absolute left-2.5 top-1/2 size-5 transform -translate-y-1/2"
                avatar={avatar}
            />
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

const RecordRow = ({
    record,
}: {
    record: TablePunishmentRecord;
}): ReactElement => {
    const colorReason = (truncate: boolean) =>
        record.reason
            ? formatMinecraftString(
                  truncate ? truncateText(record.reason, 52) : record.reason
              )
            : "No reason specified";
    return (
        <Dialog>
            <DialogTrigger asChild>
                <TableRow className="cursor-pointer">
                    <TableCell className="hidden md:table-cell text-zinc-300/75">
                        {numberWithCommas(record.id)}
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-3 items-center">
                            <PlayerAvatar
                                avatar={record.player?.avatar ?? STEVE_AVATAR}
                            />
                            <span className="truncate">
                                {record.player?.username ?? "Player (Bedrock?)"}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-3 items-center">
                            <PlayerAvatar
                                avatar={record.staff?.avatar ?? STEVE_AVATAR}
                            />
                            <span className="truncate">
                                {record.staff?.username ?? record.bannedByName}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="max-h-12 overflow-hidden">
                        <SimpleTooltip
                            content={<span>{colorReason(false)}</span>}
                        >
                            <div>{colorReason(true)}</div>
                        </SimpleTooltip>
                    </TableCell>
                    <TableCell>
                        {DateTime.fromMillis(record.time).toRelative()}
                    </TableCell>
                </TableRow>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

const PlayerAvatar = ({
    avatar,
    className,
}: {
    avatar: string | undefined;
    className?: string;
}): ReactElement => (
    <Image
        className={cn(className)}
        src={avatar ?? STEVE_AVATAR}
        alt="Player Avatar"
        width={22}
        height={22}
        draggable={false}
    />
);

export default RecordsTable;
