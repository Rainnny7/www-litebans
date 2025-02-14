import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkDiscordRole } from "~/common/auth";

const isForbiddenRoute = createRouteMatcher(["/forbidden"]);

export default clerkMiddleware(
    async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
        // Simply allow all routes to pass through for /forbidden.
        if (isForbiddenRoute(req)) {
            return NextResponse.next();
        }

        // If there is no userId, protect the route.
        const { userId } = await auth();
        if (!userId) {
            await auth.protect();
            return;
        }
        // Otherwise, get the user from the Clerk client and
        // check to see if they have the allowed role in Discord.
        if (!(await checkDiscordRole({ userId }))) {
            return NextResponse.redirect(new URL("/forbidden", req.url));
        }
    }
);

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
