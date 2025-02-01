import type { ReactElement } from "react";
import { currentUser, type User } from "@clerk/nextjs/server";

const DashboardPage = async (): Promise<ReactElement> => {
    const user: User | null = await currentUser();
    return (
        <main className="py-10 flex flex-col gap-3 justify-center text-center items-center">
            <h1 className="text-3xl font-bold">🏠 Dashboard</h1>
            <p className="max-w-xl text-lg">
                Hey there{" "}
                <span className="text-zinc-400">{user?.username}</span>, welcome
                to the LiteBans web interface! Here you can browse the
                punishment records for players on your server.
            </p>
        </main>
    );
};
export default DashboardPage;
