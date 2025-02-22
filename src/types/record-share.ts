import { PunishmentType } from "~/types/punishment-category";

/**
 * The type for a record share in the database.
 */
export type RecordShare = {
    /**
     * The secret key to access this share.
     */
    key: string;

    /**
     * The category of the record to share.
     */
    category: PunishmentType;

    /**
     * The ID of the record to share.
     */
    record: number;

    /**
     * Whether this share is protected.
     */
    protected: boolean;

    /**
     * The creator ID of this share.
     */
    creator: string;
};
