import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "~/env";
import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import "~/styles/globals.css";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
    title: {
        default: env.NEXT_PUBLIC_APP_NAME,
        template: `%s • ${env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    openGraph: {
        images: [
            {
                url: "/favicon.ico",
                width: 128,
                height: 128,
            },
        ],
    },
    twitter: {
        card: "summary",
    },
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
        className={cn(`${GeistSans.variable} scroll-smooth antialiased`)}
    >
        <body
            className="mx-auto w-full max-w-screen-2xl min-h-screen"
            style={{
                background:
                    "linear-gradient(to top, hsl(240, 6%, 10%), hsl(var(--background)))",
            }}
        >
            <ClerkProvider>{children}</ClerkProvider>
        </body>
    </html>
);
export default RootLayout;
