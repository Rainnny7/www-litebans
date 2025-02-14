"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkMode } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ViewTransitions } from "next-view-transitions";
import Script from "next/script";
import { type ReactElement, type ReactNode } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { env, isUsingAnalytics } from "~/env";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }): ReactElement => (
    <>
        <QueryClientProvider client={queryClient}>
            <ClerkProvider appearance={{ baseTheme: clerkDarkMode }}>
                <TooltipProvider delayDuration={100}>
                    <ViewTransitions>{children}</ViewTransitions>
                </TooltipProvider>
            </ClerkProvider>
        </QueryClientProvider>
    </>
);
export default AppProviders;
