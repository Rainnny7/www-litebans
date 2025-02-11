import { type ClassValue, clsx } from "clsx";
import { createElement, type ReactElement } from "react";
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