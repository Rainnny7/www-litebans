"use client";

import { useQuery } from "@tanstack/react-query";
import { HomeIcon, LucideProps, UsersIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { cloneElement, ReactElement } from "react";
import { getStats } from "~/actions/get-stats";
import { cn } from "~/common/utils";
import CategoriesDropdown from "~/components/navbar/categories-dropdown";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
    getAllPunishmentCategories,
    TypedPunishmentCategoryInfo,
} from "~/types/punishment-category";

type NavbarLink = {
    name: string;
    icon?: ReactElement<LucideProps>;
    href?: string | undefined;
    content?: ReactElement | undefined;
};

export type PunishmentCategoryWithCount = {
    category: TypedPunishmentCategoryInfo;
    count: number;
    error: string | undefined;
};

const NavbarLinks = (): ReactElement => {
    const { data: stats } = useQuery({
        queryKey: ["instance-stats"],
        queryFn: getStats,
    });

    const links: NavbarLink[] = [
        {
            name: "Home",
            icon: <HomeIcon />,
            href: "/",
        },
        {
            name: "Browse",
            content: (
                <CategoriesDropdown
                    categories={Object.values(getAllPunishmentCategories()).map(
                        (category: TypedPunishmentCategoryInfo) => ({
                            category,
                            count: stats?.categoryStats[category.type] ?? 0,
                            error: undefined,
                        })
                    )}
                />
            ),
        },
        {
            name: "Alts",
            icon: <UsersIcon />,
            href: "/alts",
        },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-2 sm:gap-3 transition-all transform-gpu">
                {links.map((link) => (
                    <NavigationMenuItem key={link.name}>
                        {link.href ? (
                            <Link
                                href={link.href}
                                prefetch={false}
                                legacyBehavior
                                passHref
                            >
                                <NavigationMenuLink
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "px-2.5 py-1 h-8 flex flex-row gap-2 items-center bg-muted/40 text-sm rounded-lg hover:bg-muted/25 cursor-default transition-all transform-gpu"
                                    )}
                                    draggable={false}
                                >
                                    {link.icon &&
                                        cloneElement(link.icon, {
                                            className:
                                                "hidden lg:flex size-3.5",
                                        })}
                                    <span>{link.name}</span>
                                </NavigationMenuLink>
                            </Link>
                        ) : (
                            link.content
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};
export default NavbarLinks;
