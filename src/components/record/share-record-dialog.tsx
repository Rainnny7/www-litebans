import { KeyRound, Share, Timer } from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { toast } from "sonner";
import { shareRecord } from "~/actions/share-record";
import { CONSOLE_AVATAR, STEVE_AVATAR } from "~/common/player";
import { formatMinecraftString, toHumanReadableTime } from "~/common/string";
import { copyToClipboard, numberWithCommas } from "~/common/utils";
import PlayerAvatar from "~/components/player-avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { env } from "~/env";
import { TablePunishmentRecord } from "~/types/punishment-record";
import { RecordShare } from "~/types/record-share";

type ShareRecordPopoverProps = {
    record: TablePunishmentRecord;
    children: ReactNode;
};

const ShareRecordDialog = ({ record, children }: ShareRecordPopoverProps) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Share Record</DialogTitle>

                {/* ID & Category */}
                <DialogDescription>
                    ID: #{numberWithCommas(record.id)} •{" "}
                    {record.category.displayName}
                </DialogDescription>
            </DialogHeader>
            <RecordPreview record={record} />
            <ShareOptions record={record} />
        </DialogContent>
    </Dialog>
);

const RecordPreview = ({
    record,
}: {
    record: TablePunishmentRecord;
}): ReactElement => (
    <div className="flex flex-col">
        <h1 className="font-bold">Record Preview</h1>
        <div className="mt-2.5 px-4 py-3.5 flex flex-col gap-2 justify-center text-center text-muted-foreground border rounded-xl">
            {/* Top */}
            <div className="flex gap-3 justify-center items-center">
                {/* Staff */}
                <PlayerAvatarName
                    avatar={record.staff?.avatar ?? CONSOLE_AVATAR}
                    name={record.staff?.username as string}
                />
                punished{" "}
                <PlayerAvatarName
                    avatar={record.player?.avatar ?? STEVE_AVATAR}
                    name={record.player?.username ?? "Unknown Player"}
                />
                for:
            </div>

            {/* Reason */}
            <p>{formatMinecraftString(`§7${record.reason}`)}</p>
        </div>
    </div>
);

const ShareOptions = ({ record }: { record: TablePunishmentRecord }) => (
    <div className="flex flex-col">
        <h1 className="font-bold">Share Options</h1>
        <form
            className="mt-2.5 flex flex-col gap-2"
            action={async (form: FormData) => {
                toast.promise(shareRecord(form, record), {
                    loading: "Creating share...",
                    success: async (share: RecordShare) => {
                        await copyToClipboard(
                            `${env.NEXT_PUBLIC_APP_URL}/share/${share.key}`
                        );
                        return "Copied the share URL to your clipboard!";
                    },
                    error: "Failed creating the share ):",
                });
            }}
        >
            {/* Staff Only? */}
            <div className="flex gap-2 items-center">
                <KeyRound className="size-4 text-muted-foreground" />
                <div className="font-medium">Staff Only?</div>
                <Checkbox name="protected" defaultChecked={true} />
            </div>

            {/* TODO: Expires */}
            <div className="flex gap-2 items-center text-muted-foreground">
                <Timer className="size-4" />
                <div className="text-white font-medium">Expires</div>
                <span>{toHumanReadableTime(1000 * 60 * 60, false)}</span>
            </div>

            {/* Share */}
            <DialogClose asChild>
                <Button type="submit" className="mt-2.5">
                    <Share />
                    Share Record
                </Button>
            </DialogClose>
        </form>
    </div>
);

const PlayerAvatarName = ({
    avatar,
    name,
}: {
    avatar: string;
    name: string;
}) => (
    <div className="flex gap-1.5 items-center">
        <PlayerAvatar avatar={avatar} size={28} />
        <span className="text-white font-medium">{name}</span>
    </div>
);

export default ShareRecordDialog;
