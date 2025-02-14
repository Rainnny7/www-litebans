import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";

import { env, isProd } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This
 * avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
    connection: Pool | undefined;
};

const connection =
    globalForDb.connection ?? createPool({ uri: env.DRIZZLE_DATABASE_URL });
if (!isProd) globalForDb.connection = connection;

export const db = drizzle(connection, { schema, mode: "default" });
