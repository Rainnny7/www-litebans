import Link from "next/link";
import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";

/**
 * The not found page of the app.
 *
 * @returns the not found page
 */
const NotFoundPage = (): ReactElement => (
    <main className="py-20 flex flex-col gap-3 justify-center text-center items-center">
        <h1 className="text-2xl font-bold">🙈 Not Found</h1>
        <p className="max-w-md opacity-75">
            The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
            <Button>Back Home</Button>
        </Link>
    </main>
);
export default NotFoundPage;
