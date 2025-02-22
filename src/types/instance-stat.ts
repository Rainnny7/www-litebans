import { PunishmentType } from "~/types/punishment-category";

/**
 * The stats for the instance of
 * LiteBans this app is connected to.
 */
export type InstanceStats = {
    /**
     * The number of unique players recorded.
     */
    uniquePlayers: number;

    /**
     * The amount of servers on the instance.
     */
    servers: number;

    /**
     * The amount of records per-category.
     */
    categoryStats: Record<PunishmentType, number>;
};
