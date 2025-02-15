import { Fingerprint, IdCard, Info, PencilLine } from "lucide-react";
import { type ReactNode } from "react";
import { copyWithToast } from "~/common/utils";
import RecordDialog from "~/components/record/record-dialog";
import { Button } from "~/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { type TablePunishmentRecord } from "~/types/punishment-record";

type RecordContextMenuProps = {
    record: TablePunishmentRecord;
    children?: ReactNode;
};

const RecordContextMenu = ({ record, children }: RecordContextMenuProps) => {
    const playerName: string = record.player?.username ?? "Unknown";
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={async () =>
                        copyWithToast(playerName, `Copied Player Name`)
                    }
                >
                    <PencilLine />
                    Copy Player Name
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={async () =>
                        copyWithToast(record.uuid, `Copied Player UUID`)
                    }
                >
                    <Fingerprint />
                    Copy Player UUID
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={async () =>
                        copyWithToast(record.id.toString(), `Copied Record ID`)
                    }
                >
                    <IdCard />
                    Copy Record ID
                </ContextMenuItem>
                <ContextMenuSeparator />
                <RecordDialog record={record}>
                    <Button
                        className="w-full h-8 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default justify-start items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                        variant="ghost"
                    >
                        <Info />
                        Info
                    </Button>
                </RecordDialog>
            </ContextMenuContent>
        </ContextMenu>
    );
};
export default RecordContextMenu;
