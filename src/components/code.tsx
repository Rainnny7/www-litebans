import { type ReactNode } from "react";
import { cn } from "~/common/utils";

type CodeProps = {
    className?: string;
    prefix: string | ReactNode;
    children: React.ReactNode;
};

const Code = ({ className, prefix, children }: CodeProps) => (
    <code
        className={cn(
            "px-2.5 py-0.5 flex gap-1 items-center bg-muted/75 rounded-lg shadow-lg",
            className
        )}
    >
        <span className="text-muted-foreground">{prefix}</span>{" "}
        <div className="flex items-center">{children}</div>
    </code>
);
export default Code;
