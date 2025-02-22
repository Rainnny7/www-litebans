"use client";

import { LucideProps } from "lucide-react";
import { Link } from "next-view-transitions";
import { cloneElement, ReactElement } from "react";
import { cn } from "~/common/utils";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

type NavbarLink = {
    name: string;
    icon?: ReactElement<LucideProps>;
    href?: string | undefined;
    content?: ReactElement | undefined;
};

const NavbarLinks = ({ links }: { links: NavbarLink[] }): ReactElement => (
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
                                        className: "hidden lg:flex size-3.5",
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
export default NavbarLinks;
