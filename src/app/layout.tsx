import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "~/env";
import "~/styles/globals.css";

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
    <html lang="en" className={`${GeistSans.variable}`}>
        <body>
            <ClerkProvider>{children}</ClerkProvider>
        </body>
    </html>
);
export default RootLayout;
