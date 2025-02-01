import { env } from "~/env";
import Image from "next/image";
import type { ReactElement } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
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
                    unoptimized
                />
                <h1 className="hidden sm:flex text-xl font-semibold">
                    {env.NEXT_PUBLIC_APP_NAME}
                </h1>
            </Link>

            {/* Categories */}
            <div className="flex gap-4 items-center">
                {getAllPunishmentCategories().map((category) => (
                    <Link
                        key={category.type}
                        className="text-sm hover:opacity-75 transition-all transform-gpu"
                        href={`/records/${category.type}`}
                    >
                        {category.displayName}s
                    </Link>
                ))}
            </div>
        </div>

        {/* Right */}
        <div className="my-auto">
            <UserButton />
        </div>
    </nav>
);
export default Navbar;
