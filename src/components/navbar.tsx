import { Protect, SignedIn, UserButton } from "@clerk/nextjs";
import { count } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { Badge } from "~/components/ui/badge";
import { env } from "~/env";
import { numberWithCommas } from "~/lib/utils";
import { db } from "~/server/drizzle";
import { getAllPunishmentCategories } from "~/types/punishment-category";

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
                    draggable={false}
                />
                <h1 className="hidden sm:flex text-xl font-semibold">
                    {env.NEXT_PUBLIC_APP_NAME}
                </h1>
            </Link>

            {/* Categories */}
            <Protect>
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
            </Protect>
        </div>

        {/* Right */}
        <div className="my-auto">
            <UserButton />
        </div>
    </nav>
);
export default Navbar;
