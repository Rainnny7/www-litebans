import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import type { ReactElement } from "react";
import type { PunishmentCategoryInfo } from "~/types/punishment-category";
import { db } from "~/server/drizzle";

const RecordsTable = async ({
    category,
}: {
    category: PunishmentCategoryInfo;
}): Promise<ReactElement> => {
    const records: any[] = await db.select().from(category.table).limit(200);
    return (
        <div className="px-2 bg-muted/25 rounded-lg border border-muted">
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
                    {records.map((record) => {
                        return (
                            <TableRow key={record.id}>
                                <TableCell>{record.uuid}</TableCell>
                                <TableCell>{record.bannedByName}</TableCell>
                                <TableCell>{record.reason}</TableCell>
                                <TableCell className="text-right">
                                    {record.time}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
export default RecordsTable;
