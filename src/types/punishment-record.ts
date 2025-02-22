import { type PunishmentCategoryInfo } from "~/types/punishment-category";

/**
 * A base punishment record type.
 */
export type BasePunishmentRecord = {
    id: number;
    uuid: string;
    ip: string;
    reason: string;
    bannedByUuid: string | null;
    bannedByName: string | null;
    removedByUuid: string | null;
    removedByName: string | null;
    removedByDate: number | null;
    time: number;
    until: number;
    serverScope: string | null;
    serverOrigin: string | null;
    silent: boolean;
    ipban: boolean;
    ipbanWildcard: boolean;
    active: boolean;
    template: number;
};

/**
 * The status of a punishment record.
 */
export type PunishmentRecordStatus = "active" | "removed" | "expired";

/**
 * A punishment record type with additional data for the data table.
 */
export type TablePunishmentRecord = BasePunishmentRecord & {
    category: PunishmentCategoryInfo;
    status: PunishmentRecordStatus;
    permanent: boolean;
    player?: TablePlayerData | undefined;
    staff?: TablePlayerData | undefined;
};

/**
 * Player data for each player in a {@link TablePunishmentRecord}.
 */
export type TablePlayerData = {
    uuid: string;
    username: string;
    avatar: string;
};
