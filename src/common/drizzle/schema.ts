import {
    bigint,
    boolean,
    mysqlTable,
    timestamp,
    tinyint,
    varchar,
} from "drizzle-orm/mysql-core";

/**
 * The history records table.
 * <p>
 * This table stores the history of all
 * player UUIDs, usernames, and IP addresses.
 * </p>
 */
export const historyRecords = mysqlTable("litebans_history", {
    id: bigint("id", { mode: "number", unsigned: true }).notNull(),
    date: timestamp("date").notNull().defaultNow().onUpdateNow(),
    name: varchar("name", { length: 16 }).notNull(),
    uuid: varchar("uuid", { length: 36 }).notNull(),
    ip: varchar("ip", { length: 45 }).notNull(),
});

/**
 * The ban punishment records table.
 */
export const banPunishmentRecords = mysqlTable("litebans_bans", {
    id: bigint("id", { mode: "number", unsigned: true }).notNull(),
    uuid: varchar("uuid", { length: 36 }),
    ip: varchar("ip", { length: 45 }),
    reason: varchar("reason", { length: 2048 }).notNull(),
    bannedByUuid: varchar("banned_by_uuid", { length: 36 }),
    bannedByName: varchar("banned_by_name", { length: 128 }),
    removedByUuid: varchar("removed_by_uuid", { length: 36 }),
    removedByName: varchar("removed_by_name", { length: 128 }),
    removedByDate: timestamp("removed_by_date")
        .notNull()
        .defaultNow()
        .onUpdateNow(),
    time: bigint("time", { mode: "number" }).notNull(),
    until: bigint("until", { mode: "number" }).notNull(),
    serverScope: varchar("server_scope", { length: 32 }),
    serverOrigin: varchar("server_origin", { length: 32 }),
    silent: boolean("silent").notNull(),
    ipban: boolean("ipban").notNull(),
    ipbanWildcard: boolean("ipban_wildcard").notNull(),
    active: boolean("active").notNull(),
    removedByReason: varchar("removed_by_reason", { length: 2048 }),
    template: tinyint("template").notNull().default(255),
});

/**
 * The mute punishment records table.
 */
export const mutePunishmentRecords = mysqlTable("litebans_mutes", {
    id: bigint("id", { mode: "number", unsigned: true }).notNull(),
    uuid: varchar("uuid", { length: 36 }),
    ip: varchar("ip", { length: 45 }),
    reason: varchar("reason", { length: 2048 }).notNull(),
    bannedByUuid: varchar("banned_by_uuid", { length: 36 }),
    bannedByName: varchar("banned_by_name", { length: 128 }),
    removedByUuid: varchar("removed_by_uuid", { length: 36 }),
    removedByName: varchar("removed_by_name", { length: 128 }),
    removedByDate: timestamp("removed_by_date")
        .notNull()
        .defaultNow()
        .onUpdateNow(),
    time: bigint("time", { mode: "number" }).notNull(),
    until: bigint("until", { mode: "number" }).notNull(),
    serverScope: varchar("server_scope", { length: 32 }),
    serverOrigin: varchar("server_origin", { length: 32 }),
    silent: boolean("silent").notNull(),
    ipban: boolean("ipban").notNull(),
    ipbanWildcard: boolean("ipban_wildcard").notNull(),
    active: boolean("active").notNull(),
    removedByReason: varchar("removed_by_reason", { length: 2048 }),
    template: tinyint("template").notNull().default(255),
});

/**
 * The warning punishment records table.
 */
export const warningPunishmentRecords = mysqlTable("litebans_warnings", {
    id: bigint("id", { mode: "number", unsigned: true }).notNull(),
    uuid: varchar("uuid", { length: 36 }),
    ip: varchar("ip", { length: 45 }),
    reason: varchar("reason", { length: 2048 }).notNull(),
    bannedByUuid: varchar("banned_by_uuid", { length: 36 }),
    bannedByName: varchar("banned_by_name", { length: 128 }),
    removedByUuid: varchar("removed_by_uuid", { length: 36 }),
    removedByName: varchar("removed_by_name", { length: 128 }),
    removedByDate: timestamp("removed_by_date")
        .notNull()
        .defaultNow()
        .onUpdateNow(),
    time: bigint("time", { mode: "number" }).notNull(),
    until: bigint("until", { mode: "number" }).notNull(),
    serverScope: varchar("server_scope", { length: 32 }),
    serverOrigin: varchar("server_origin", { length: 32 }),
    silent: boolean("silent").notNull(),
    ipban: boolean("ipban").notNull(),
    ipbanWildcard: boolean("ipban_wildcard").notNull(),
    active: boolean("active").notNull(),
    warned: boolean("warned").notNull(),
    removedByReason: varchar("removed_by_reason", { length: 2048 }),
    template: tinyint("template").notNull().default(255),
});

/**
 * The kick punishment records table.
 */
export const kickPunishmentRecords = mysqlTable("litebans_kicks", {
    id: bigint("id", { mode: "number", unsigned: true }).notNull(),
    uuid: varchar("uuid", { length: 36 }),
    ip: varchar("ip", { length: 45 }),
    reason: varchar("reason", { length: 2048 }).notNull(),
    bannedByUuid: varchar("banned_by_uuid", { length: 36 }),
    bannedByName: varchar("banned_by_name", { length: 128 }),
    time: bigint("time", { mode: "number" }).notNull(),
    until: bigint("until", { mode: "number" }).notNull(),
    serverScope: varchar("server_scope", { length: 32 }),
    serverOrigin: varchar("server_origin", { length: 32 }),
    silent: boolean("silent").notNull(),
    ipban: boolean("ipban").notNull(),
    ipbanWildcard: boolean("ipban_wildcard").notNull(),
    active: boolean("active").notNull(),
    template: tinyint("template").notNull().default(255),
});
