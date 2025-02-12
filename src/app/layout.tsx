import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import AppProviders from "~/components/app-providers";
import Navbar from "~/components/navbar";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

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
                    "linear-gradient(to top, hsl(240, 6%, 10%), var(--background))",
            }}
        >
            <AppProviders>
                <div className="min-h-screen px-7 pb-5 max-w-(--breakpoint-xl) mx-auto flex flex-col gap-5">
                    <Navbar />
                    {children}
                </div>
            </AppProviders>
        </body>
    </html>
);
export default RootLayout;
