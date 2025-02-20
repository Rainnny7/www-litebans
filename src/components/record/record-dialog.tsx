import { type ReactNode } from "react";
import { STEVE_AVATAR } from "~/common/player";
import PlayerAvatar from "~/components/player-avatar";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { type TablePunishmentRecord } from "~/types/punishment-record";

type RecordDialogProps = {
    record: TablePunishmentRecord;
    children: ReactNode;
};

const RecordDialog = ({ record, children }: RecordDialogProps) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full !max-w-[40rem]">
            {/* Top */}
            <div className="flex items-center">
                <PlayerAvatar avatar={record.player?.avatar ?? STEVE_AVATAR} />
                <span className="truncate">
                    {record.player?.username ?? "Player (Bedrock?)"}
                </span>
            </div>
        </DialogContent>
    </Dialog>
);
export default RecordDialog;
