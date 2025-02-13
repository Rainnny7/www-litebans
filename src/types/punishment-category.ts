import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import {
    banPunishmentRecords,
    kickPunishmentRecords,
    mutePunishmentRecords,
    warningPunishmentRecords,
} from "~/server/drizzle/schema";

export type PunishmentCategory = Record<
    "ban" | "mute" | "warning" | "kick",
    PunishmentCategoryInfo
>;

export type PunishmentCategoryInfo = {
    displayName: string;
    table: MySqlTableWithColumns<any>;
};

export const PUNISHMENT_CATEGORIES: PunishmentCategory = {
    ban: {
        displayName: "Ban",
        table: banPunishmentRecords,
    },
    mute: {
        displayName: "Mute",
        table: mutePunishmentRecords,
    },
    warning: {
        displayName: "Warn",
        table: warningPunishmentRecords,
    },
    kick: {
        displayName: "Kick",
        table: kickPunishmentRecords,
    },
};

export type PunishmentType = keyof PunishmentCategory;

export const PUNISHMENT_TYPES = Object.keys(
    PUNISHMENT_CATEGORIES
) as PunishmentType[];

/**
 * Get a category by its name.
 *
 * @param name the name of the category
 */
export const getPunishmentCategory = (
    name: string
): PunishmentCategoryInfo | undefined => {
    return name in PUNISHMENT_CATEGORIES
        ? PUNISHMENT_CATEGORIES[name as PunishmentType]
        : undefined;
};

/**
 * Get all punishment categories.
 */
export const getAllPunishmentCategories = (): Array<
    {
        type: PunishmentType;
    } & PunishmentCategoryInfo
> =>
    PUNISHMENT_TYPES.map((type: PunishmentType) => ({
        type,
        ...PUNISHMENT_CATEGORIES[type],
    }));
