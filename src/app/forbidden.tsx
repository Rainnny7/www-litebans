import type { ReactElement } from "react";

/**
 * The forbidden page.
 * This page is displayed when the user
 * is not authorized to access a resource.
 *
 * @returns the forbidden page
 */
const ForbiddenPage = (): ReactElement => (
    <main className="py-20 flex flex-col gap-3 justify-center text-center items-center">
        <h1 className="text-2xl font-bold">🚫 Forbidden</h1>
        <p className="max-w-md opacity-75">
            You&apos;re not authorized to access this resource. If you believe
            this is an error, please contact a system administrator.
        </p>
    </main>
);
export default ForbiddenPage;
