import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { type ReactElement } from "react";
import SimpleCombobox from "~/components/simple-combobox";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "~/components/ui/pagination";
import { type Page } from "~/lib/paginator";
import { cn, numberWithCommas } from "~/lib/utils";

type PaginationControlsProps = {
    page: Page<any> | undefined;
    setPage: (page: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (value: string) => void;
};

const PaginationControls = ({
    page,
    setPage,
    rowsPerPage,
    onRowsPerPageChange,
}: PaginationControlsProps): ReactElement => {
    return (
        <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-2 items-center">
            {/* Left - Total Records */}
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
                Showing rows {numberWithCommas(page?.metadata.start ?? 0)} -{" "}
                {numberWithCommas(page?.metadata.end ?? 0)} of{" "}
                {numberWithCommas(page?.metadata.totalItems ?? 0)} records
            </div>

            {/* Right */}
            <div className="flex gap-3 items-center">
                {/* Rows Per Page */}
                <SimpleCombobox
                    className="w-24"
                    placeholder="Rows Per Page"
                    items={[
                        { value: "5", label: "5" },
                        { value: "10", label: "10" },
                        { value: "25", label: "25" },
                        { value: "50", label: "50" },
                        { value: "100", label: "100" },
                    ]}
                    withSearch={false}
                    value={rowsPerPage.toString()}
                    onChange={onRowsPerPageChange}
                />

                {/* Controls */}
                <Pagination>
                    <PaginationContent>
                        {/* First Page */}
                        <PaginationItem>
                            <PaginationLink
                                className={cn(
                                    page &&
                                        page.metadata.page <= 1 &&
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
                                    page &&
                                        page.metadata.page <= 1 &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => {
                                    const pageNumber: number =
                                        page?.metadata.page ?? 1;
                                    if (pageNumber > 1) {
                                        setPage(pageNumber - 1);
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
                                Page{" "}
                                {numberWithCommas(page?.metadata.page ?? 1)} of{" "}
                                {numberWithCommas(
                                    page?.metadata.totalPages ?? 1
                                )}
                            </PaginationLink>
                        </PaginationItem>

                        {/* Next Page */}
                        <PaginationItem>
                            <PaginationLink
                                className={cn(
                                    page &&
                                        page.metadata.page >=
                                            (page.metadata.totalPages ?? 1) &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => {
                                    const pageNumber: number =
                                        page?.metadata.page ?? 1;
                                    if (
                                        pageNumber <
                                        (page?.metadata.totalPages ?? 1)
                                    ) {
                                        setPage(pageNumber + 1);
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
                                    page &&
                                        page.metadata.page >=
                                            (page.metadata.totalPages ?? 1) &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() =>
                                    setPage(page?.metadata.totalPages ?? 1)
                                }
                            >
                                <ChevronsRight className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};
export default PaginationControls;
