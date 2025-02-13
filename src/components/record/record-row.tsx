import { DateTime } from "luxon";
import { type ReactElement } from "react";
import PlayerAvatar from "~/components/player-avatar";
import RecordDialog from "~/components/record/record-dialog";
import SimpleTooltip from "~/components/simple-tooltip";
import { TableCell, TableRow } from "~/components/ui/table";
import { CONSOLE_AVATAR, STEVE_AVATAR } from "~/lib/player";
import { formatMinecraftString, truncateText } from "~/lib/string";
import { numberWithCommas } from "~/lib/utils";
import { type TablePunishmentRecord } from "~/types/punishment-record";

const RecordRow = ({
    record,
}: {
    record: TablePunishmentRecord;
}): ReactElement => {
    const recordIssued: DateTime = DateTime.fromMillis(record.time);
    const colorReason = (truncate: boolean) =>
        record.reason
            ? formatMinecraftString(
                  truncate ? truncateText(record.reason, 52) : record.reason
              )
            : "No reason specified";
    return (
        <RecordDialog
            record={record}
            trigger={
                <TableRow className="cursor-pointer">
                    <TableCell className="hidden md:table-cell text-zinc-300/75">
                        {numberWithCommas(record.id)}
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-3 items-center">
                            <PlayerAvatar
                                avatar={record.player?.avatar ?? STEVE_AVATAR}
                            />
                            <span className="truncate">
                                {record.player?.username ?? "Player (Bedrock?)"}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-3 items-center">
                            <PlayerAvatar
                                avatar={
                                    record.bannedByUuid === "CONSOLE"
                                        ? CONSOLE_AVATAR
                                        : (record.staff?.avatar ?? STEVE_AVATAR)
                                }
                            />
                            <span className="truncate">
                                {record.staff?.username ?? record.bannedByName}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="max-h-12 overflow-hidden">
                        <SimpleTooltip
                            content={<span>{colorReason(false)}</span>}
                        >
                            <div className="w-fit">{colorReason(true)}</div>
                        </SimpleTooltip>
                    </TableCell>
                    <TableCell>
                        <SimpleTooltip
                            content={recordIssued.toLocaleString(
                                DateTime.DATETIME_MED
                            )}
                        >
                            <div className="w-fit">
                                {recordIssued.toRelative()}
                            </div>
                        </SimpleTooltip>
                    </TableCell>
                </TableRow>
            }
        />
    );
};
export default RecordRow;
