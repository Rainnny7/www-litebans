import type { ReactElement } from "react";
import { db } from "src/server/drizzle";
import { banPunishmentRecords } from "~/server/drizzle/schema";

const DashboardPage = async (): Promise<ReactElement> => {
    const bans: any[] = await db.select().from(banPunishmentRecords).limit(50);
    console.log({ bans });
    return (
        <main className="min-h-screen flex flex-col gap-3 justify-center items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
        </main>
    );
};
export default DashboardPage;
