import Link from "next/link";
import { type ReactElement } from "react";

const Footer = (): ReactElement => (
    <footer className="mt-auto pt-5 flex justify-center items-center text-sm opacity-75">
        Made with <span className="animate-pulse">❤️</span> by{" "}
        <Link
            className="ml-1 text-red-400 hover:opacity-75 transition-all transform-gpu"
            href="https://github.com/Rainnny7"
            target="_blank"
            draggable={false}
        >
            Rainnny
        </Link>
    </footer>
);
export default Footer;
