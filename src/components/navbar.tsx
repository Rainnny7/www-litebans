import { env } from "~/env";
import Image from "next/image";
import type { ReactElement } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getAllPunishmentCategories } from "~/types/punishment-category";
import { Badge } from "~/components/ui/badge";
import { db } from "~/server/drizzle";
import { count } from "drizzle-orm";
import { numberWithCommas } from "~/lib/utils";

const Navbar = (): ReactElement => (
    <nav className="-mx-7 px-7 py-5 flex justify-between items-center border-b border-muted">
        {/* Left */}
        <div className="flex gap-7 sm:gap-10 items-center">
            {/* Branding */}
            <Link
                className="flex gap-4 items-center hover:opacity-75 transition-all transform-gpu"
                href="/"
            >
                <Image
                    src={env.NEXT_PUBLIC_APP_LOGO}
                    alt={`${env.NEXT_PUBLIC_APP_NAME} Logo`}
                    width={40}
                    height={40}
                    unoptimized
                />
                <h1 className="hidden sm:flex text-xl font-semibold">
                    {env.NEXT_PUBLIC_APP_NAME}
                </h1>
            </Link>

            {/* Categories */}
            <div className="flex gap-3 items-center">
                {getAllPunishmentCategories().map(async (category) => {
                    const recordCountResult = await db
                        .select({ count: count() })
                        .from(category.table);
                    return (
                        <Link
                            key={category.type}
                            className="px-2.5 py-1 flex gap-2 items-center bg-muted/40 text-sm rounded-lg hover:opacity-75 transition-all transform-gpu"
                            href={`/records/${category.type}`}
                        >
                            <span>{category.displayName}s</span>
                            <Badge
                                className="hidden lg:flex px-2 border-white/20"
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
        </div>

        {/* Right */}
        <div className="my-auto">
            <UserButton />
        </div>
    </nav>
);
export default Navbar;
