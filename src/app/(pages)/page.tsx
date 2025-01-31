import type { ReactElement } from "react";
import { db } from "~/server/db";
import { banPunishmentRecords } from "~/server/db/schema";

const DashboardPage = async (): ReactElement => {
    const bans: any[] = await db.select().from(banPunishmentRecords).limit(50);
    console.log({ bans });
    return (
        <main className="min-h-screen flex flex-col gap-3 justify-center items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
        </main>
    );
};
export default DashboardPage;
