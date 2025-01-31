import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import { env } from "~/env";

export const metadata: Metadata = {
    title: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
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
