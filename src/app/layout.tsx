import { GeistSans } from "geist/font/sans";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { env } from "~/env";
import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import "~/styles/globals.css";
import { cn } from "~/lib/utils";
import Navbar from "~/components/navbar";
import { dark as clerkDarkMode } from "@clerk/themes";

export const metadata: Metadata = {
    title: {
        default: env.NEXT_PUBLIC_APP_NAME,
        template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    openGraph: {
        images: [
            {
                url: env.NEXT_PUBLIC_APP_LOGO,
                width: 128,
                height: 128,
            },
        ],
    },
    twitter: {
        card: "summary",
    },
    icons: [{ rel: "icon", url: env.NEXT_PUBLIC_APP_LOGO }],
};
export const viewport: Viewport = {
    themeColor: "#E6E6E6",
};

/**
 * The primary layout for this app.
 */
const RootLayout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>): ReactElement => (
    <html
        lang="en"
        className={cn(
            `${GeistSans.variable} scroll-smooth antialiased select-none`
        )}
    >
        <body
            style={{
                background:
                    "linear-gradient(to top, hsl(240, 6%, 10%), hsl(var(--background)))",
            }}
        >
            <ClerkProvider
                appearance={{
                    baseTheme: clerkDarkMode,
                }}
            >
                {/*<Navbar />*/}
                <div className="min-h-screen px-7 pb-5 max-w-screen-xl mx-auto flex flex-col gap-5">
                    <SignedIn>
                        <Navbar />
                    </SignedIn>
                    {children}
                </div>
            </ClerkProvider>
        </body>
    </html>
);
export default RootLayout;
