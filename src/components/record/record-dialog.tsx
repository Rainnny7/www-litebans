import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { type TablePunishmentRecord } from "~/types/punishment-record";

const RecordDialog = ({ record }: { record: TablePunishmentRecord }) => (
    <DialogHeader>
        <DialogTitle>#{record.id}</DialogTitle>
        <DialogDescription>
            Viewing extra information about records is not yet available.
        </DialogDescription>
    </DialogHeader>
);
export default RecordDialog;
