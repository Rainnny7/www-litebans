import type { ReactElement } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const DashboardPage = (): ReactElement => (
    <main className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
    </main>
);
export default DashboardPage;
