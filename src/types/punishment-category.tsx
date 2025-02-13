import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import type { LucideProps } from "lucide-react";
import { Footprints, Hammer, Scroll, Speaker, VolumeOff } from "lucide-react";
import { type ReactElement } from "react";
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
    icon: ReactElement<LucideProps>;
    table: MySqlTableWithColumns<any>;
};

export const PUNISHMENT_CATEGORIES: PunishmentCategory = {
    ban: {
        displayName: "Ban",
        icon: <Hammer />,
        table: banPunishmentRecords,
    },
    mute: {
        displayName: "Mute",
        icon: <VolumeOff />,
        table: mutePunishmentRecords,
    },
    warning: {
        displayName: "Warn",
        icon: <Scroll />,
        table: warningPunishmentRecords,
    },
    kick: {
        displayName: "Kick",
        icon: <Footprints />,
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
