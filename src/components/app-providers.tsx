"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkMode } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ViewTransitions } from "next-view-transitions";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }): ReactElement => {
    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => {
            // Only prevent default if not triggered from a custom context menu
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
                <TooltipProvider delayDuration={100}>
                    <ViewTransitions>{children}</ViewTransitions>
                </TooltipProvider>
            </ClerkProvider>
        </QueryClientProvider>
    );
};
export default AppProviders;
