import { auth } from "@clerk/nextjs/server";
import { forbidden } from "next/navigation";
import { isAuthorized } from "~/actions/is-authorized";

/**
 * Handle checking if the current user is
 * authorized, and if not, redirect them
 * to /forbidden.
 */
export const handleAuthCheck = async (): Promise<{ userId: string }> => {
    // Check if the user is authorized
    const { userId } = await auth();
    if (!userId || !(await isAuthorized({ userId }))) {
        forbidden();
    }
    return { userId };
};
