"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkMode } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ViewTransitions } from "next-view-transitions";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import AuthProvider from "~/providers/auth-provider";

const queryClient = new QueryClient();

/**
 * The app providers for this app.
 * <p>
 * This is a wrapper component that provides the app with the
 * necessary providers for the app to function properly.
 * </p>
 *
 * @param children the children to render
 * @returns the children
 */
const AppProviders = ({ children }: { children: ReactNode }): ReactElement => {
    // Only prevent default if not triggered from a custom context menu
    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest('[role="menu"]')) {
                event.preventDefault();
            }
        };
        document.addEventListener("contextmenu", handleContextMenu);
        return () =>
            document.removeEventListener("contextmenu", handleContextMenu);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ClerkProvider appearance={{ baseTheme: clerkDarkMode }}>
                <AuthProvider>
                    <TooltipProvider delayDuration={300}>
                        <ViewTransitions>{children}</ViewTransitions>
                    </TooltipProvider>
                </AuthProvider>
            </ClerkProvider>
        </QueryClientProvider>
    );
};
export default AppProviders;
