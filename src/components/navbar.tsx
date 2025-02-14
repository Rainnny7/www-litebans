import { UserButton } from "@clerk/nextjs";
import { currentUser, type User } from "@clerk/nextjs/server";
import { count } from "drizzle-orm";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { cloneElement, type ReactElement } from "react";
import { checkDiscordRole } from "~/common/auth";
import { numberWithCommas } from "~/common/utils";
import ServerStatus from "~/components/server-status";
import { Badge } from "~/components/ui/badge";
import { env } from "~/env";
import { db } from "~/server/drizzle";
import { getAllPunishmentCategories } from "~/types/punishment-category";

const Navbar = async (): Promise<ReactElement> => {
    const user: User | null = await currentUser();
    const isAuthorized = user && (await checkDiscordRole({ userId: user.id }));
    return (
        <nav className="-mx-7 px-7 py-5 flex justify-between gap-3.5 items-center border-b border-muted">
            {/* Left */}
            <div className="flex gap-4 sm:gap-6 xl:gap-10 items-center transition-all transform-gpu">
                {/* Branding */}
                <Link
                    className="flex gap-4 items-center hover:opacity-75 transition-all transform-gpu"
                    href="/"
                    draggable={false}
                >
                    <Image
                        src={env.NEXT_PUBLIC_APP_LOGO}
                        alt={`${env.NEXT_PUBLIC_APP_NAME} Logo`}
                        width={40}
                        height={40}
                        draggable={false}
                    />
                    <h1 className="hidden lg:flex text-xl font-bold">
                        {env.NEXT_PUBLIC_APP_NAME}
                    </h1>
                </Link>

                {/* Categories */}
                {isAuthorized && (
                    <div className="flex gap-2 sm:gap-3 items-center transition-all transform-gpu">
                        {getAllPunishmentCategories().map(async (category) => {
                            const recordCountResult = await db
                                .select({ count: count() })
                                .from(category.table);
                            return (
                                <Link
                                    key={category.type}
                                    className="px-2.5 py-1 flex gap-2 items-center bg-muted/40 text-sm rounded-lg hover:opacity-75 transition-all transform-gpu"
                                    href={`/records/${category.type}`}
                                    draggable={false}
                                >
                                    {cloneElement(category.icon, {
                                        className: "hidden lg:flex size-3.5",
                                    })}

                                    <span>{category.displayName}s</span>
                                    <Badge
                                        className="hidden md:flex px-2"
                                        variant="outline"
                                    >
                                        {numberWithCommas(
                                            recordCountResult.at(0)?.count ?? 0
                                        )}
                                    </Badge>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="my-auto flex gap-4 items-center">
                {isAuthorized && env.NEXT_PUBLIC_MINECRAFT_SERVER_IP && (
                    <ServerStatus />
                )}
                <UserButton />
            </div>
        </nav>
    );
};
export default Navbar;
