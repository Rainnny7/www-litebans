"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleXIcon } from "lucide-react";
import Image from "next/image";
import { type ReactElement } from "react";
import {
    getMinecraftServer,
    ServerPlatform,
    type CachedJavaMinecraftServer,
} from "restfulmc-lib";
import { cn, numberWithCommas } from "~/common/utils";
import Code from "~/components/code";
import { Skeleton } from "~/components/ui/skeleton";
import { env } from "~/env";

const ServerStatus = (): ReactElement => {
    const {
        data: status,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["serverStatus", env.NEXT_PUBLIC_MINECRAFT_SERVER_IP],
        queryFn: async () =>
            (await getMinecraftServer(
                ServerPlatform.JAVA,
                env.NEXT_PUBLIC_MINECRAFT_SERVER_IP ?? "hypixel.net"
            )) as CachedJavaMinecraftServer,
    });

    // Wait for the status to be loaded
    if (!status || error || isLoading) {
        return (
            <div className="relative">
                <Skeleton className="w-40 h-6" />
                <h1
                    className={cn(
                        "absolute inset-0 flex gap-1 justify-center items-center text-xs animate-pulse",
                        error && "text-red-400/65"
                    )}
                >
                    {error && <CircleXIcon className="size-3" />}
                    {error ? "Failed loading status" : "Loading MC Status..."}
                </h1>
            </div>
        );
    }

    return (
        <Code
            className="hidden xs:flex py-1 text-xs gap-2"
            prefix={
                <span className="flex gap-2 items-center">
                    <Image
                        src={status.favicon?.url ?? env.NEXT_PUBLIC_APP_LOGO}
                        alt={`${env.NEXT_PUBLIC_APP_NAME} Logo`}
                        width={16}
                        height={16}
                    />
                    <span className="hidden xl:block">Players:</span>
                </span>
            }
        >
            {numberWithCommas(status.players.online)}
            <span className="hidden lg:block">
                /{numberWithCommas(status.players.max)}
            </span>
        </Code>
    );
};
export default ServerStatus;
