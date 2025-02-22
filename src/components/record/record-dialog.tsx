"use client";

import {
    Calendar,
    Copy,
    Fingerprint,
    Gavel,
    Server,
    Timer,
    type LucideProps,
} from "lucide-react";
import { DateTime, Duration } from "luxon";
import {
    cloneElement,
    useCallback,
    useEffect,
    useState,
    type ReactElement,
    type ReactNode,
} from "react";
import { CONSOLE_AVATAR, STEVE_AVATAR } from "~/common/player";
import {
    capitalizeWords,
    formatMinecraftString,
    toDateTime,
    toHumanReadableTime,
} from "~/common/string";
import { cn, copyWithToast, numberWithCommas } from "~/common/utils";
import PlayerAvatar from "~/components/player-avatar";
import RecordStatus from "~/components/record/record-status";
import SimpleTooltip from "~/components/simple-tooltip";
import { Badge } from "~/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { type TablePunishmentRecord } from "~/types/punishment-record";

type RecordDialogProps = {
    record: TablePunishmentRecord;
    children: ReactNode;
};

const RecordDialog = ({ record, children }: RecordDialogProps) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full !max-w-[40rem]">
            <DialogHeader className="text-left">
                <DialogTitle className="flex gap-2.5 items-center">
                    <span>Record Details</span>

                    {/* Badges */}
                    <div className="flex gap-1.5 items-center">
                        <RecordStatus status={record.status} />
                        {record.ipban && (
                            <Badge variant="outline">
                                IP {record.category.displayName}
                            </Badge>
                        )}
                        {record.silent && (
                            <Badge variant="outline">Silent</Badge>
                        )}
                    </div>
                </DialogTitle>
                <DialogDescription>
                    ID: #{numberWithCommas(record.id)} •{" "}
                    {record.category.displayName}
                </DialogDescription>
            </DialogHeader>
            <PlayerInformation record={record} />
            <Separator />
            <RecordInformation record={record} />
        </DialogContent>
    </Dialog>
);

const PlayerInformation = ({ record }: { record: TablePunishmentRecord }) => (
    <div className="flex flex-col">
        <h1 className="font-bold">Player Information</h1>
        <div className="mt-2.5 px-4 py-3.5 flex flex-col gap-2 justify-center border rounded-xl">
            {/* Avatar & Name */}
            <div className="flex gap-3 items-center">
                <PlayerAvatar
                    avatar={record.player?.avatar ?? STEVE_AVATAR}
                    size={28}
                />
                <span className="font-medium">
                    {record.player?.username ?? "Unknown Player"}
                </span>
            </div>

            {/* UUID */}
            <div className="ml-0.5 flex gap-3 items-center text-muted-foreground">
                <Fingerprint className="size-6" />
                <span>{record.uuid}</span>
                <Copy
                    className="size-4 cursor-pointer hover:opacity-75 transition-all transform-gpu"
                    onClick={async () =>
                        copyWithToast(record.uuid, `Copied Player UUID`)
                    }
                />
            </div>
        </div>
    </div>
);

const RecordInformation = ({ record }: { record: TablePunishmentRecord }) => {
    const duration: string = record.permanent
        ? "Permanent"
        : toHumanReadableTime(Duration.fromMillis(record.until - record.time));

    // Get the remaining time
    const getRemaining = useCallback(() => {
        return (
            record.status === "active" &&
            !record.permanent &&
            record.until > Date.now() &&
            toHumanReadableTime(Duration.fromMillis(record.until - Date.now()))
        );
    }, [record]);
    const [remaining, setRemaining] = useState<string | false>(getRemaining());

    // Get the age time
    const getAge = useCallback(() => {
        return toHumanReadableTime(
            Duration.fromMillis(Date.now() - record.time)
        );
    }, [record]);
    const [age, setAge] = useState<string | false>(getAge());

    // Update the remaining and age time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(getRemaining());
            setAge(getAge());
        }, 1000);
        return () => clearInterval(interval);
    }, [getRemaining, getAge]);

    return (
        <div className="flex flex-col">
            <h1 className="font-bold">Record Information</h1>
            <div className="mt-2.5 flex flex-col gap-2">
                <InfoElement
                    name="Reason"
                    icon={<Gavel />}
                    value={formatMinecraftString(`§7${record.reason}`)}
                    inline={false}
                />
                <InfoElement
                    name="Issued by"
                    icon={<Fingerprint />}
                    value={
                        <>
                            <PlayerAvatar
                                avatar={record.staff?.avatar ?? CONSOLE_AVATAR}
                                size={20}
                            />
                            {record.bannedByName}
                        </>
                    }
                />
                <InfoElement
                    name="Duration"
                    icon={<Timer />}
                    value={
                        <SimpleTooltip
                            content={
                                remaining
                                    ? `Expires at ${toDateTime(DateTime.fromMillis(record.until))}`
                                    : undefined
                            }
                        >
                            <div className="flex gap-1 items-center">
                                {duration}
                                {remaining && ` (${remaining} remaining)`}
                            </div>
                        </SimpleTooltip>
                    }
                />
                <InfoElement
                    name="Age"
                    icon={<Calendar />}
                    value={
                        <SimpleTooltip
                            content={`Issued on ${toDateTime(DateTime.fromMillis(record.time))}`}
                        >
                            <div>{age}</div>
                        </SimpleTooltip>
                    }
                />
                <InfoElement
                    name="Server"
                    icon={<Server />}
                    value={
                        <>
                            {capitalizeWords(record.serverOrigin) ?? "Unknown"}{" "}
                            - (Scope: {record.serverScope})
                        </>
                    }
                />
            </div>
        </div>
    );
};

const InfoElement = ({
    name,
    icon,
    value,
    inline = true,
}: {
    name: string;
    icon: ReactElement<LucideProps>;
    value: ReactElement[] | ReactElement | string;
    inline?: boolean;
}) => (
    <div className="flex gap-2">
        {cloneElement(icon, {
            className: "mt-1 size-4 text-muted-foreground",
        })}
        <div className={cn(inline && "flex gap-2 items-center")}>
            <div className="font-medium">{name}</div>
            <div
                className={cn(
                    !inline && "text-sm",
                    "flex items-center gap-1 text-muted-foreground"
                )}
            >
                {value}
            </div>
        </div>
    </div>
);

export default RecordDialog;
