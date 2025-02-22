import { type ReactElement } from "react";
import { cn } from "~/common/utils";
import { Badge } from "~/components/ui/badge";
import { capitalizeWords } from "../../common/string";

const STATUS_COLORS: Record<string, string> = {
    active: "bg-[#00AA00]",
    removed: "bg-destructive",
    expired: "bg-secondary",
};

const RecordStatus = ({ status }: { status: string }): ReactElement => (
    <Badge
        className={cn(
            "w-[4.1rem] justify-center text-white hover:bg-primary",
            `${STATUS_COLORS[status]} hover:${STATUS_COLORS[status]}`
        )}
    >
        {capitalizeWords(status)}
    </Badge>
);
export default RecordStatus;
