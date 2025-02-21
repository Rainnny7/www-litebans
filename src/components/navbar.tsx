import { UserButton } from "@clerk/nextjs";
import { count } from "drizzle-orm";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { cloneElement, type ReactElement } from "react";
import { numberWithCommas } from "~/common/utils";
import Protected from "~/components/auth/protected";
import ServerStatus from "~/components/server-status";
import { Badge } from "~/components/ui/badge";
import { env } from "~/env";
import { db } from "~/server/drizzle";
import {
    getAllPunishmentCategories,
    type TypedPunishmentCategoryInfo,
} from "~/types/punishment-category";

const Navbar = async (): Promise<ReactElement> => {
    /**
     * Fetch the record count for the given category.
     *
     * @param category the category to fetch the count for
     * @returns the fetch response
     */
    const fetchCategoryCount = async (
        category: TypedPunishmentCategoryInfo
    ) => {
        try {
            const result = await db
                .select({ count: count() })
                .from(category.table);
            return {
                category,
                count: result.at(0)?.count ?? 0,
                error: undefined,
            };
        } catch (error) {
            console.error(`Error fetching count for ${category.type}:`, error);
            return {
                category,
                count: 0,
                error: `Failed to fetch ${category.type} count`,
            };
        }
    };

    return (
        <nav className="-mx-7 px-7 py-5 flex justify-between gap-3.5 items-center border-b border-muted">
            {/* Left */}
            <div className="flex gap-4 sm:gap-6 xl:gap-10 items-center transition-all transform-gpu">
                {/* Branding */}
                <Link
                    className="flex gap-4 items-center hover:opacity-75 transition-all transform-gpu"
                    href="/"
                    prefetch={false}
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
                <Protected>
                    <div className="flex gap-2 sm:gap-3 items-center transition-all transform-gpu">
                        {(
                            await Promise.all(
                                getAllPunishmentCategories().map((category) =>
                                    fetchCategoryCount(category)
                                )
                            )
                        ).map(({ category, count, error }) => (
                            <Link
                                key={category.type}
                                className="px-2.5 py-1 flex gap-2 items-center bg-muted/40 text-sm rounded-lg hover:opacity-75 transition-all transform-gpu"
                                href={`/records/${category.type}`}
                                prefetch={false}
                                draggable={false}
                            >
                                {cloneElement(category.icon, {
                                    className: "hidden lg:flex size-3.5",
                                })}

                                <span>{category.displayName}s</span>
                                <Badge
                                    className="hidden md:flex px-2"
                                    variant={error ? "destructive" : "outline"}
                                    title={error ?? undefined}
                                >
                                    {error ? "Error" : numberWithCommas(count)}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </Protected>
            </div>

            {/* Right */}
            <div className="my-auto flex gap-4 items-center">
                <Protected>
                    {env.NEXT_PUBLIC_MINECRAFT_SERVER_IP && <ServerStatus />}
                </Protected>
                <UserButton />
            </div>
        </nav>
    );
};
export default Navbar;
