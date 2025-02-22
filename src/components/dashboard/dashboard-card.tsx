import { ReactElement, ReactNode } from "react";
import { cn } from "~/common/utils";

type DashboardCardProps = {
    className?: string | undefined;
    children: ReactNode;
};

const DashboardCard = ({
    className,
    children,
}: DashboardCardProps): ReactElement => (
    <div
        className={cn(
            "p-3 flex bg-muted/50 border border-muted/20 rounded-lg",
            className
        )}
    >
        {children}
    </div>
);
export default DashboardCard;
