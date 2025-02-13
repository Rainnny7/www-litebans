import { cn } from "~/common/utils";

type CodeProps = {
    className?: string;
    prefix: string;
    children: React.ReactNode;
};

const Code = ({ className, prefix, children }: CodeProps) => (
    <code
        className={cn(
            "px-2.5 py-0.5 bg-muted/75 rounded-lg shadow-lg",
            className
        )}
    >
        <span className="text-muted-foreground">{prefix}</span> {children}
    </code>
);
export default Code;
