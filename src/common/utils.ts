import { type ClassValue, clsx } from "clsx";
import { type ReactNode } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names.
 *
 * @param inputs the class names to merge
 * @returns the merged class names
 */
export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

/**
 * Format a number with commas.
 *
 * @param x the number to format
 * @returns the formatted number
 */
export const numberWithCommas = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Remove fields from an object.
 *
 * @param obj the object to remove fields from
 * @param fields the fields to remove
 * @returns the object with the fields removed
 */
export const removeObjectFields = <T extends Record<string, unknown>>(
    obj: T,
    fields: string[]
): T => {
    const newObj = { ...obj };
    for (const field of fields) {
        delete newObj[field];
    }
    return newObj;
};

/**
 * Copy text to clipboard.
 *
 * @param text the text to copy
 * @param toastText the text to display in the toast
 */
export const copyWithToast = async (
    text: string,
    toastText: string | ReactNode
) => {
    await copyToClipboard(text);
    toast.success(toastText, {
        description: text,
        action: {
            label: "Got It",
            onClick: () => {
                /**/
            },
        },
    });
};

/**
 * Copy text to the clipboard.
 *
 * @param text the text to copy
 */
export const copyToClipboard = async (text: string) =>
    await navigator.clipboard.writeText(text);

/**
 * Format a response time in milliseconds to a human-readable string.
 * Returns in milliseconds if under 1 second, otherwise in seconds.
 *
 * @param ms the time in milliseconds
 * @returns formatted string with appropriate unit (ms or s)
 */
export const formatResponseTime = (ms: number): string => {
    if (ms < 1000) {
        return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
};
