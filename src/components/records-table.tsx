"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { type ChangeEvent, type ReactElement, useState } from "react";
import { getPlayer } from "restfulmc-lib";
import { useDebouncedCallback } from "use-debounce";
import { fetchRecords } from "~/actions/fetch-records";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "~/components/ui/pagination";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { type Page, Paginator } from "~/lib/paginator";
import { formatMinecraftString, truncateText } from "~/lib/string";
import { cn, numberWithCommas } from "~/lib/utils";
import { type PunishmentCategoryInfo } from "~/types/punishment-category";
import { type BasePunishmentRecord } from "~/types/punishment-record";

const STEVE_AVATAR = "https://api.restfulmc.cc/player/head/Steve.png";
const ITEMS_PER_PAGE = 10;

type TablePunishmentRecord = BasePunishmentRecord & {
    player?: { username: string; avatar: string };
};

const RecordsTable = ({
    category,
    page: initialPage,
}: {
    category: PunishmentCategoryInfo & { id: string };
    page: number;
}): ReactElement => {
    const [page, setPage] = useState<number>(initialPage);
    const [search, setSearch] = useState<string>("");
    const [paginator] = useState(() => new Paginator<BasePunishmentRecord>());

    const {
        data: records,
        isLoading,
        isFetching,
    } = useQuery<Page<TablePunishmentRecord>>({
        queryKey: ["records", page, category.id, search],
        queryFn: async () => {
            const records = await fetchRecords(category.id, {
                search,
                offset: (page - 1) * ITEMS_PER_PAGE,
                limit: ITEMS_PER_PAGE,
            });
            paginator
                .setItemsPerPage(ITEMS_PER_PAGE)
                .setTotalItems(records.total ?? 0);
            return await paginator.getPage(
                page,
                async () =>
                    await Promise.all(
                        records.records.map(async (record) => {
                            if (record.uuid === "CONSOLE") {
                                return { ...record, player: undefined };
                            }
                            try {
                                const player = await getPlayer(record.uuid);
                                return {
                                    ...record,
                                    player: {
                                        username: player.username,
                                        avatar: player.skin.parts.HEAD,
                                    },
                                };
                            } catch {
                                return { ...record, player: undefined };
                            }
                        })
                    )
            );
        },
        placeholderData: (prev) => prev,
    });

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
                                        <TableHead className="hidden lg:table-cell w-40">
                                            Issued
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading || isFetching
                                        ? [...Array(ITEMS_PER_PAGE)].map(
                                              (_, i) => <SkeletonRow key={i} />
                                          )
                                        : records?.items.map((record) => (
                                              <RecordRow
                                                  key={record.id}
                                                  record={record}
                                              />
                                          ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-2 items-center">
                    {/* Total Records */}
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        Showing rows{" "}
                        {records ? numberWithCommas(records.metadata.start) : 0}{" "}
                        - {records ? numberWithCommas(records.metadata.end) : 0}{" "}
                        of {numberWithCommas(records?.metadata.totalItems ?? 0)}{" "}
                        records
                    </div>

                    {/* Controls */}
                    <div>
                        <Pagination>
                            <PaginationContent>
                                {/* First Page */}
                                <PaginationItem>
                                    <PaginationLink
                                        className={cn(
                                            page <= 1 &&
                                                "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => setPage(1)}
                                    >
                                        <ChevronsLeft className="size-4" />
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Previous Page */}
                                <PaginationItem>
                                    <PaginationLink
                                        className={cn(
                                            page <= 1 &&
                                                "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => {
                                            if (page > 1) {
                                                setPage(page - 1);
                                            }
                                        }}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Page Number */}
                                <PaginationItem>
                                    <PaginationLink
                                        className="hover:bg-transparent"
                                        size="default"
                                        isActive={false}
                                    >
                                        Page {numberWithCommas(page)} of{" "}
                                        {numberWithCommas(
                                            records?.metadata.totalPages ?? 1
                                        )}
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Next Page */}
                                <PaginationItem>
                                    <PaginationLink
                                        className={cn(
                                            page >=
                                                (records?.metadata.totalPages ??
                                                    1) &&
                                                "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => {
                                            if (
                                                records &&
                                                page <
                                                    records.metadata.totalPages
                                            ) {
                                                setPage(page + 1);
                                            }
                                        }}
                                    >
                                        <ChevronRight className="size-4" />
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Last Page */}
                                <PaginationItem>
                                    <PaginationLink
                                        className={cn(
                                            page >=
                                                (records?.metadata.totalPages ??
                                                    1) &&
                                                "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() =>
                                            setPage(
                                                records?.metadata.totalPages ??
                                                    1
                                            )
                                        }
                                    >
                                        <ChevronsRight className="size-4" />
                                    </PaginationLink>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
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

const SkeletonRow = (): ReactElement => (
    <TableRow>
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
        <TableCell className="hidden lg:table-cell">
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
        formatMinecraftString(
            (truncate ? truncateText(record.reason, 52) : record.reason) ??
                "No reason specified"
        );
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
                    <TableCell className="truncate">
                        {record.bannedByName}
                    </TableCell>
                    <TableCell className="max-h-12 overflow-hidden">
                        <SimpleTooltip
                            content={<span>{colorReason(false)}</span>}
                        >
                            <div>{colorReason(true)}</div>
                        </SimpleTooltip>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
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
