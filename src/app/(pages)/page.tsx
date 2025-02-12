import { currentUser, type User } from "@clerk/nextjs/server";
import type { ReactElement } from "react";

/**
 * The dashboard page of the app.
 *
 * @returns the dashboard page
 */
const DashboardPage = async (): Promise<ReactElement> => {
    const user: User | null = await currentUser();
    return (
        <main className="py-20 flex flex-col gap-3 justify-center text-center items-center">
            <h1 className="text-2xl font-bold">🏠 Dashboard</h1>
            <p className="max-w-md opacity-75">
                Hey there{" "}
                <span className="text-zinc-400">{user?.username}</span>, welcome
                to the LiteBans web interface! Here you can browse the
                punishment records for players on your server.
            </p>
        </main>
    );
};
export default DashboardPage;
