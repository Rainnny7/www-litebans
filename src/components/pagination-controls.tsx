import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    LoaderCircle,
} from "lucide-react";
import {
    useState,
    type FormEvent,
    type ReactElement,
    type ReactNode,
} from "react";
import { type Page } from "~/common/paginator";
import { cn, formatResponseTime, numberWithCommas } from "~/common/utils";
import SimpleCombobox from "~/components/simple-combobox";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "~/components/ui/pagination";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

/**
 * The pagination control props.
 */
type PaginationControlsProps = {
    responseTime: number;
    page: Page<any> | undefined;
    loading: boolean;
    rowsPerPage: number;
    setPage: (page: number) => void;
    onRowsPerPageChange: (value: string) => void;
};

const PaginationControls = ({
    responseTime,
    page,
    loading,
    rowsPerPage,
    setPage,
    onRowsPerPageChange,
}: PaginationControlsProps): ReactElement => {
    const pageNumber: number = page?.metadata.page ?? 1;
    const maxPageNumber: number = page?.metadata.totalPages ?? 1;
    return (
        <div className="w-full flex flex-col-reverse lg:flex-row justify-between gap-3 items-center">
            {/* Left - Total Records */}
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
                Showing rows {numberWithCommas(page?.metadata.start ?? 0)} -{" "}
                {numberWithCommas(page?.metadata.end ?? 0)} of{" "}
                {numberWithCommas(page?.metadata.totalItems ?? 0)} records (Took{" "}
                {formatResponseTime(responseTime)})
            </div>

            {/* Right */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 items-center">
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
                                    pageNumber <= 1 &&
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
                                    pageNumber <= 1 &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => {
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
                            <PageSelector
                                page={pageNumber}
                                maxPage={maxPageNumber}
                                setPage={setPage}
                            >
                                <div className="relative">
                                    {loading && (
                                        <div className="absolute inset-0 flex justify-center items-center bg-zinc-900/50 backdrop-blur-xs rounded-xl">
                                            <LoaderCircle className="size-5 animate-spin" />
                                        </div>
                                    )}

                                    <PaginationLink
                                        className="px-2"
                                        size="default"
                                        isActive={false}
                                    >
                                        Page {numberWithCommas(pageNumber)} of{" "}
                                        {numberWithCommas(maxPageNumber)}
                                    </PaginationLink>
                                </div>
                            </PageSelector>
                        </PaginationItem>

                        {/* Next Page */}
                        <PaginationItem>
                            <PaginationLink
                                className={cn(
                                    pageNumber >= maxPageNumber &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => {
                                    if (pageNumber < maxPageNumber) {
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
                                    pageNumber >= maxPageNumber &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => setPage(maxPageNumber)}
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

const PageSelector = ({
    page,
    maxPage,
    children,
    setPage,
}: {
    page: number;
    maxPage: number;
    children: ReactNode;
    setPage: (page: number) => void;
}): ReactElement => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-36 p-2">
                <form
                    className="flex flex-col gap-2.5"
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                        const target: number = Number(
                            (event.target as HTMLFormElement).page.value
                        );
                        event.preventDefault();
                        setOpen(false);
                        if (
                            target &&
                            target !== page &&
                            target >= 1 &&
                            target <= maxPage
                        ) {
                            setPage(target);
                        }
                    }}
                >
                    <Input
                        id="page"
                        className="h-8"
                        type="number"
                        placeholder="Page"
                        defaultValue={page}
                        min={1}
                        max={maxPage}
                    />
                    <Button className="bg-zinc-800" size="sm">
                        Go
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default PaginationControls;
