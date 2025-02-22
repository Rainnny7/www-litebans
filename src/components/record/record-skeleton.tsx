import { type ReactElement } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { TableCell, TableRow } from "~/components/ui/table";

const RecordSkeleton = ({
    opacity = 1,
}: {
    opacity?: number;
}): ReactElement => (
    <TableRow style={{ opacity }}>
        <TableCell className="hidden md:table-cell text-zinc-300/75">
            <Skeleton className="w-12 h-4" />
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
        <TableCell>
            <Skeleton className="w-[4.1rem] h-5" />
        </TableCell>
        <TableCell className="flex justify-center">
            <Skeleton className="w-[22px] h-[22px] rounded-sm" />
        </TableCell>
    </TableRow>
);
export default RecordSkeleton;
