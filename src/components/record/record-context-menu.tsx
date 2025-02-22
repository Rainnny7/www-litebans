import {
    Copy,
    Fingerprint,
    IdCard,
    Info,
    PencilLine,
    Share,
} from "lucide-react";
import { type ReactNode } from "react";
import { copyWithToast } from "~/common/utils";
import RecordDialog from "~/components/record/record-dialog";
import ShareRecordDialog from "~/components/record/share-record-dialog";
import { Button } from "~/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { type TablePunishmentRecord } from "~/types/punishment-record";

type RecordContextMenuProps = {
    record: TablePunishmentRecord;
    children?: ReactNode;
};

const buttonStyles: string =
    "w-full h-8 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default justify-start items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const RecordContextMenu = ({ record, children }: RecordContextMenuProps) => {
    const playerName: string = record.player?.username ?? "Unknown Player";
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                {/* Copy Sub-Menu */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger className="gap-2">
                        <Copy className="text-muted-foreground" />
                        Copy
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-36">
                        <ContextMenuItem
                            onClick={async () =>
                                copyWithToast(playerName, `Copied Player Name`)
                            }
                        >
                            <PencilLine />
                            Player Name
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={async () =>
                                copyWithToast(record.uuid, `Copied Player UUID`)
                            }
                        >
                            <Fingerprint />
                            Player UUID
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={async () =>
                                copyWithToast(
                                    record.id.toString(),
                                    `Copied Record ID`
                                )
                            }
                        >
                            <IdCard />
                            Record ID
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                {/* Share */}
                <ShareRecordDialog record={record}>
                    <Button className={buttonStyles} variant="ghost">
                        <Share />
                        Share
                    </Button>
                </ShareRecordDialog>

                {/* Misc */}
                <ContextMenuSeparator />
                <RecordDialog record={record}>
                    <Button className={buttonStyles} variant="ghost">
                        <Info />
                        Details
                    </Button>
                </RecordDialog>
            </ContextMenuContent>
        </ContextMenu>
    );
};
export default RecordContextMenu;
