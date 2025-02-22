import { UserButton } from "@clerk/nextjs";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { type ReactElement } from "react";
import Protected from "~/components/auth/protected";
import NavbarLinks from "~/components/navbar/navbar-links";
import ServerStatus from "~/components/server-status";
import { env } from "~/env";

const Navbar = (): ReactElement => (
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
                <NavbarLinks />
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
export default Navbar;
