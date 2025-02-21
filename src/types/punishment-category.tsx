import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import type { LucideProps } from "lucide-react";
import { Footprints, Hammer, Scroll, VolumeOff } from "lucide-react";
import type { ReactElement } from "react";
import {
    banPunishmentRecords,
    kickPunishmentRecords,
    mutePunishmentRecords,
    warningPunishmentRecords,
} from "~/common/drizzle/schema";

// Core types
export type PunishmentType = "ban" | "mute" | "warning" | "kick";

export type PunishmentCategoryInfo = {
    displayName: string;
    icon: ReactElement<LucideProps>;
    table: MySqlTableWithColumns<any>;
};

export type TypedPunishmentCategoryInfo = {
    type: PunishmentType;
} & PunishmentCategoryInfo;

export type PunishmentCategory = Record<PunishmentType, PunishmentCategoryInfo>;

// Constants
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
} as const;

export const PUNISHMENT_TYPES: PunishmentType[] = Object.keys(
    PUNISHMENT_CATEGORIES
) as PunishmentType[];

// Utility functions
/**
 * Get a punishment category by its name.

 * @param name the name of the category to retrieve
 * @returns the category info if found, undefined otherwise
 */
export const getPunishmentCategory = (
    name: string
): PunishmentCategoryInfo | undefined =>
    PUNISHMENT_CATEGORIES[name as PunishmentType];

/**
 * Get all punishment categories with their corresponding types.
 *
 * @returns An array of punishment categories with their types
 */
export const getAllPunishmentCategories =
    (): Array<TypedPunishmentCategoryInfo> =>
        PUNISHMENT_TYPES.map((type: PunishmentType) => ({
            type,
            ...PUNISHMENT_CATEGORIES[type],
        }));
