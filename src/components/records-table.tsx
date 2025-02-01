"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";
import { Paginator } from "~/lib/paginator";
import { ReactElement, useState } from "react";

const RecordsTable = ({ records }: { records: any[] }): ReactElement => {
    const [page, setPage] = useState<number>(1);

    const paginatedRecords = new Paginator<any>()
        .setItemsPerPage(10)
        .setItems(records)
        .setTotalItems(records.length);

    const previousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        if (page < paginatedRecords.getPage(page).metadata.totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <div className="px-2 bg-muted/25 rounded-lg border border-muted">
            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Issued</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedRecords.getPage(page).items.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell>{record.uuid}</TableCell>
                            <TableCell>{record.bannedByName}</TableCell>
                            <TableCell>{record.reason}</TableCell>
                            <TableCell className="text-right">
                                {record.time}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Pagination className="py-2.5">
                <PaginationContent className="w-full justify-between">
                    <PaginationItem>
                        <PaginationPrevious onClick={previousPage} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>{page}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={nextPage} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
export default RecordsTable;
