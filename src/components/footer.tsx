import Link from "next/link";
import { type ReactElement } from "react";
import Code from "~/components/code";
import { env } from "~/env";

const Footer = (): ReactElement => (
    <footer className="mt-auto pt-5 flex flex-col justify-center gap-2 items-center text-sm opacity-75">
        {/* Credits */}
        <div>
            Made with <span className="animate-pulse">❤️</span> by{" "}
            <Link
                className="ml-1 text-red-400 hover:opacity-75 transition-all transform-gpu"
                href="https://github.com/Rainnny7"
                target="_blank"
                draggable={false}
            >
                Rainnny
            </Link>
        </div>

        {/* Build Info */}
        <Code prefix="Build ID:">
            {env.NEXT_PUBLIC_BUILD_ID}-{env.NEXT_PUBLIC_BUILD_TIME}
        </Code>
    </footer>
);
export default Footer;
