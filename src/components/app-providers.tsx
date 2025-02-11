"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkMode } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactElement, type ReactNode } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }): ReactElement => {
    return (
        <QueryClientProvider client={queryClient}>
            <ClerkProvider
                appearance={{
                    baseTheme: clerkDarkMode,
                }}
            >
                <TooltipProvider delayDuration={100}>
                    {children}
                </TooltipProvider>
            </ClerkProvider>
        </QueryClientProvider>
    );
};
export default AppProviders;
