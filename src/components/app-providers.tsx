"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkMode } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { env } from "~/env";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }): ReactElement => {
    useEffect(() => {
        posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
            person_profiles: "always",
        });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ClerkProvider appearance={{ baseTheme: clerkDarkMode }}>
                <TooltipProvider delayDuration={100}>
                    <PHProvider client={posthog}>{children}</PHProvider>
                </TooltipProvider>
            </ClerkProvider>
        </QueryClientProvider>
    );
};
export default AppProviders;
