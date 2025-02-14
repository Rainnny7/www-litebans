"use client";

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    type Table as ReactTable,
    type Row,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    cloneElement,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    useState,
} from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    rowsPerPage?: number;
    skeletonRow: ReactNode;
    noResultsMessage?: string;
    contextMenu?: (row: Row<TData>) => ReactElement<{ children?: ReactNode }>;
}

type ColumnAlignment = Record<string, string>;

export function DataTable<TData, TValue>({
    columns,
    data,
    loading,
    rowsPerPage = 10,
    skeletonRow,
    noResultsMessage = "No results for your query.",
    contextMenu,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnAlignments: ColumnAlignment = {
        actions: "text-right",
    };

    const table: ReactTable<TData> = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={columnAlignments[header.id]}
                                    style={{ width: header.getSize() }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                    <span>
                                        {header.column.getIsSorted()
                                            ? header.column.getIsSorted() ===
                                              "desc"
                                                ? ">"
                                                : "<"
                                            : ""}
                                    </span>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading && skeletonRow ? (
                        [...Array(rowsPerPage)].map((_, i) =>
                            cloneElement(
                                skeletonRow as ReactElement,
                                {
                                    key: i,
                                    opacity: 1 - (i / rowsPerPage) * 0.9,
                                } as CSSProperties
                            )
                        )
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const rowContent = (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                            className={
                                                columnAlignments[cell.column.id]
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );

                            return contextMenu
                                ? cloneElement(contextMenu(row), {
                                      key: row.id,
                                      children: rowContent,
                                  })
                                : rowContent;
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                {noResultsMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
