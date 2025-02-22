import { TestTube2 } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const DemoBanner = (): ReactElement => (
    <Alert className="mx-auto max-w-fit">
        <TestTube2 className="size-4 text-yellow-500" />
        <AlertTitle>Hello There 😃</AlertTitle>
        <AlertDescription className="inline-block">
            You&apos;re viewing a demo version of this app! Looking to get the
            full experience? Check out the{" "}
            <Link
                className="text-yellow-500 hover:opacity-90 transition-all transform-gpu"
                href="https://github.com/Rainnny7/www-litebans"
                target="_blank"
            >
                GitHub
            </Link>
            !
        </AlertDescription>
    </Alert>
);
export default DemoBanner;
