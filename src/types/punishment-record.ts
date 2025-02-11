export type BasePunishmentRecord = {
    id: number;
    uuid: string;
    ip: string;
    reason: string;
    bannedByUuid: string | null;
    bannedByName: string | null;
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
