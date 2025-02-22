"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleHelp, LucideProps, Server, Users } from "lucide-react";
import { Link } from "next-view-transitions";
import { cloneElement, ReactElement } from "react";
import { getStats } from "~/actions/get-stats";
import { capitalizeWords } from "~/common/string";
import { numberWithCommas } from "~/common/utils";
import { Skeleton } from "~/components/ui/skeleton";
import {
    getPunishmentCategory,
    PUNISHMENT_TYPES,
} from "~/types/punishment-category";

const GlobalsStats = () => {
    const { data: stats } = useQuery({
        queryKey: ["instance-stats"],
        queryFn: getStats,
    });
    return (
        <div className="flex gap-3 justify-center items-center">
            <Stat
                name="Unique Players"
                description="The total number of players."
                icon={<Users />}
                value={
                    stats ? numberWithCommas(stats.uniquePlayers) : undefined
                }
            />
            <Stat
                name="Servers"
                description="The total number of servers."
                icon={<Server />}
                value={stats?.servers}
            />

            {/* Category Stats */}
            {PUNISHMENT_TYPES.map((category) => (
                <Stat
                    key={category}
                    name={`${capitalizeWords(category)}s`}
                    description={`Click to view ${category} records.`}
                    icon={
                        getPunishmentCategory(category)?.icon ?? <CircleHelp />
                    }
                    value={
                        stats
                            ? numberWithCommas(stats.categoryStats[category])
                            : undefined
                    }
                    href={`/records/${category}`}
                />
            ))}
        </div>
    );
};

const Stat = ({
    name,
    description,
    icon,
    value,
    href,
}: {
    name: string;
    description: string;
    icon: ReactElement<LucideProps>;
    value: any;
    href?: string;
}) => {
    const card: ReactElement = (
        <div className="relative p-3 w-48 h-28 flex justify-between bg-muted/50 border border-muted/20 rounded-lg">
            {/* Name & Value */}
            <div className="flex flex-col gap-1.5">
                <h1 className="font-medium">{name}</h1>

                <div className="flex flex-col gap-0.5">
                    {value ? (
                        <div className="text-2xl font-bold">{value}</div>
                    ) : (
                        <Skeleton className="w-20 h-8" />
                    )}

                    <p className="text-xs text-muted-foreground text-wrap">
                        {description}
                    </p>
                </div>
            </div>

            {/* Icon */}
            {cloneElement(icon, {
                className:
                    "absolute top-3 right-3 size-5 text-muted-foreground",
            })}
        </div>
    );
    return href ? (
        <Link
            className="hover:opacity-75 cursor-default transition-all transform-gpu"
            href={href}
        >
            {card}
        </Link>
    ) : (
        card
    );
};

export default GlobalsStats;
