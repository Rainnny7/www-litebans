import { type ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { type TablePunishmentRecord } from "~/types/punishment-record";

type RecordDialogProps = {
    record: TablePunishmentRecord;
    children: ReactNode;
};

const RecordDialog = ({ record, children }: RecordDialogProps) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>#{record.id}</DialogTitle>
                <DialogDescription>
                    Viewing extra information about records is not yet
                    available.
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
);
export default RecordDialog;
