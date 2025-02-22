import { currentUser, type User } from "@clerk/nextjs/server";
import { forbidden } from "next/navigation";
import type { ReactElement } from "react";
import GlobalsStats from "~/components/dashboard/globals-stats";
import RecentRecords from "~/components/dashboard/recent-records";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

/**
 * The dashboard page of the app.
 *
 * @returns the dashboard page
 */
const DashboardPage = async (): Promise<ReactElement> => {
    const user: User | null = await currentUser();
    if (!user) forbidden();
    return (
        <div className="relative flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col gap-1.5">
                <h1 className="flex items-center gap-2 text-xl font-bold">
                    🏠 Dashboard
                </h1>
                <p className="max-w-md opacity-75">
                    Hey there{" "}
                    <span className="text-zinc-400">{user.username}</span>,
                    welcome to the LiteBans web interface!
                </p>
            </div>

            {/* Content */}
            <GlobalsStats />
            <Separator />
            <div className="w-full h-64 flex gap-4">
                <Skeleton className="w-full" />
                <RecentRecords />
            </div>
        </div>
    );
};
export default DashboardPage;
