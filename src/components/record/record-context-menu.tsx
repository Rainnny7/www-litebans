import { IdCard } from "lucide-react";
import { type ReactNode } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { copyWithToast } from "~/lib/utils";
import { type TablePunishmentRecord } from "~/types/punishment-record";

type RecordContextMenuProps = {
    record: TablePunishmentRecord;
    children: ReactNode;
};

const RecordContextMenu = ({ record, children }: RecordContextMenuProps) => {
    const playerName: string = record.player?.username ?? "Unknown";
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={async () =>
                        copyWithToast(
                            playerName,
                            `Copied Player Name: ${playerName}`
                        )
                    }
                >
                    <IdCard />
                    Copy Player Name
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={async () =>
                        copyWithToast(
                            record.uuid,
                            `Copied Player UUID: ${record.uuid}`
                        )
                    }
                >
                    <IdCard />
                    Copy Player UUID
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onClick={async () =>
                        copyWithToast(
                            record.id.toString(),
                            `Copied Record ID: #${record.id}`
                        )
                    }
                >
                    <IdCard />
                    Copy Record ID
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
export default RecordContextMenu;
