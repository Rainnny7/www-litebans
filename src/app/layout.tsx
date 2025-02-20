import type { Metadata, Viewport } from "next";
import { type NextFont } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactElement, ReactNode } from "react";
import { cn } from "~/common/utils";
import AppProviders from "~/components/app-providers";
import Footer from "~/components/footer";
import HeroPattern from "~/components/hero-pattern";
import Navbar from "~/components/navbar";
import OnekoKitty from "~/components/oneko-kitty";
import { Toaster } from "~/components/ui/sonner";
import { env, isProd, isUsingAnalytics } from "~/env";
import "~/styles/globals.css";

// Default metadata for the app
export const metadata: Metadata = {
    title: {
        default: env.NEXT_PUBLIC_APP_NAME,
        template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
    },
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    openGraph: {
        images: [{ url: env.NEXT_PUBLIC_APP_LOGO, width: 128, height: 128 }],
    },
    twitter: { card: "summary" },
    icons: [{ rel: "icon", url: env.NEXT_PUBLIC_APP_LOGO }],
};
export const viewport: Viewport = { themeColor: "#E6E6E6" };

const satoshi: NextFont = localFont({
    src: "../font/Satoshi.ttf",
});

/**
 * The primary layout for this app.
 */
const RootLayout = ({
    children,
}: Readonly<{ children: ReactNode }>): ReactElement => (
    <html
        lang="en"
        className={cn(
            `${satoshi.className} scroll-smooth antialiased select-none`
        )}
    >
        <body
            style={{
                background:
                    "linear-gradient(to top, hsl(240, 6%, 10%), var(--background))",
            }}
        >
            {/* Handle analytics */}
            {isProd && isUsingAnalytics && (
                <Script
                    src={`${env.ANALYTICS_HOST}/script.js`}
                    data-website-id={env.ANALYTICS_ID}
                    defer
                />
            )}

            <AppProviders>
                <OnekoKitty />
                <div className="min-h-screen px-7 pb-5 max-w-(--breakpoint-xl) mx-auto flex flex-col gap-5">
                    <HeroPattern />
                    <Navbar />
                    {children}
                    <Footer />
                </div>
                <Toaster />
            </AppProviders>
        </body>
    </html>
);
export default RootLayout;
