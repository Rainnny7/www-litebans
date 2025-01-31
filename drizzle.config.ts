import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
    schema: "./src/server/db/schema.ts",
    dialect: "mysql",
    dbCredentials: {
        url: env.DRIZZLE_DATABASE_URL,
    },
    tablesFilter: ["litebans_*"],
} satisfies Config;
