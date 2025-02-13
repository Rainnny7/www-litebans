"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            className="toaster group"
            theme={theme as ToasterProps["theme"]}
            position="bottom-center"
            duration={9000000}
            toastOptions={{
                classNames: {
                    toast: "group toast !px-5 group-[.toaster]:!bg-[#0E0E11] group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-lg",
                    description: "group-[.toast]:!text-muted-foreground",
                    actionButton:
                        "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
