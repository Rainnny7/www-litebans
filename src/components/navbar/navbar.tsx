import { UserButton } from "@clerk/nextjs";
import { count } from "drizzle-orm";
import { HomeIcon, UsersIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { type ReactElement } from "react";
import { db } from "~/common/drizzle";
import Protected from "~/components/auth/protected";
import CategoriesDropdown from "~/components/navbar/categories-dropdown";
import NavbarLinks from "~/components/navbar/navbar-links";
import ServerStatus from "~/components/server-status";
import { env } from "~/env";
import {
    getAllPunishmentCategories,
    type TypedPunishmentCategoryInfo,
} from "~/types/punishment-category";

export type PunishmentCategoryWithCount = {
    category: TypedPunishmentCategoryInfo;
    count: number;
    error: string | undefined;
};

const Navbar = async (): Promise<ReactElement> => {
    /**
     * Fetch the record count for the given category.
     *
     * @param category the category to fetch the count for
     * @returns the fetch response
     */
    const fetchCategoryCount = async (
        category: TypedPunishmentCategoryInfo
    ): Promise<PunishmentCategoryWithCount> => {
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

    const categories = await Promise.all(
        getAllPunishmentCategories().map((category) =>
            fetchCategoryCount(category)
        )
    );

    return (
        <nav className="-mx-7 px-7 py-5 flex justify-between gap-3.5 items-center border-b border-muted z-50">
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

                {/* Links */}
                <Protected>
                    <NavbarLinks
                        links={[
                            {
                                name: "Home",
                                icon: <HomeIcon />,
                                href: "/",
                            },
                            {
                                name: "Browse",
                                content: (
                                    <CategoriesDropdown
                                        categories={categories}
                                    />
                                ),
                            },
                            {
                                name: "Alts",
                                icon: <UsersIcon />,
                                href: "/alts",
                            },
                        ]}
                    />
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
