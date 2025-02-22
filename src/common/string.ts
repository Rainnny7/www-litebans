import { DateTime } from "luxon";
import { createElement, type ReactElement } from "react";

/**
 * Map of Minecraft color codes to their hex values
 */
const MINECRAFT_COLORS: Record<string, string> = {
    "0": "#000000", // Black
    "1": "#0000AA", // Dark Blue
    "2": "#00AA00", // Dark Green
    "3": "#00AAAA", // Dark Aqua
    "4": "#AA0000", // Dark Red
    "5": "#AA00AA", // Dark Purple
    "6": "#FFAA00", // Gold
    "7": "#AAAAAA", // Gray
    "8": "#555555", // Dark Gray
    "9": "#5555FF", // Blue
    a: "#55FF55", // Green
    b: "#55FFFF", // Aqua
    c: "#FF5555", // Red
    d: "#FF55FF", // Light Purple
    e: "#FFFF55", // Yellow
    f: "#FFFFFF", // White
};

type TimeUnit = {
    unit: string;
    shortUnit: string;
    ms: number;
};

const TIME_UNITS: TimeUnit[] = [
    { unit: "year", shortUnit: "y", ms: 31536000000 },
    { unit: "month", shortUnit: "mo", ms: 2592000000 },
    { unit: "day", shortUnit: "d", ms: 86400000 },
    { unit: "hour", shortUnit: "h", ms: 3600000 },
    { unit: "minute", shortUnit: "m", ms: 60000 },
    { unit: "second", shortUnit: "s", ms: 1000 },
    { unit: "millisecond", shortUnit: "ms", ms: 1 },
];

const ALPHABET_STRING = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMERIC_STRING = "0123456789";
const SPECIAL_STRING = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Capitalize the first letter of
 * each word in the given string.
 *
 * @param str the string to capitalize
 * @return the capitalized string
 */
export const capitalizeWords = (
    str: string | undefined | null
): string | undefined =>
    str?.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase());

/**
 * Truncate text to a maximum length.
 *
 * @param text the text to truncate
 * @param maxLength the maximum length
 */
export const truncateText = (text: string, maxLength: number): string =>
    text.length > maxLength
        ? text.slice(0, maxLength - 3).trim() + "..."
        : text;

/**
 * Generate a random string with the given length.
 *
 * @param length the length of the string
 * @param alphabet whether the string should contain alphabet characters
 * @param numeric whether the string should contain numeric characters
 * @param special whether the string should contain special characters
 * @returns the generated random string
 */
export function generateRandom(
    length: number,
    alphabet: boolean = true,
    numeric: boolean = true,
    special: boolean = false
): string {
    if (length < 1) {
        throw new Error("Length must be at least 1");
    }
    if (!alphabet && !numeric && !special) {
        throw new Error(
            "At least one of alphabet, numeric, or special must be true"
        );
    }

    // Build the symbols string
    let symbols = "";
    if (alphabet) symbols += ALPHABET_STRING;
    if (numeric) symbols += NUMERIC_STRING;
    if (special) symbols += SPECIAL_STRING;

    // Generate the random string
    return Array(length)
        .fill("")
        .map(() => symbols.charAt(Math.floor(Math.random() * symbols.length)))
        .join("");
}

/**
 * Convert a Minecraft formatted string to colored spans
 *
 * @param text The text containing Minecraft color codes
 * @returns JSX elements with appropriate colors
 */
export const formatMinecraftString = (text: string): ReactElement[] => {
    const parts = text.replace(/&/g, "§").split(/(§[0-9a-fk-or])/);
    let currentColor = "#FFFFFF";

    return parts.reduce<ReactElement[]>((elements, part, index) => {
        if (part.startsWith("§") && part.length > 1) {
            const colorCode: string | undefined = part[1]?.toLowerCase();
            currentColor =
                (colorCode && MINECRAFT_COLORS[colorCode]) ?? currentColor;
            return elements;
        }
        if (part) {
            elements.push(
                createElement(
                    "span",
                    { key: index, style: { color: currentColor } },
                    part
                )
            );
        }
        return elements;
    }, []);
};

/**
 * Converts a duration to a human-readable string.
 * Example: 1h 2m 3s
 *
 * @param time the duration to convert
 * @param short whether to use the short unit names
 * @returns the human-readable string
 * @credit http://github.com/RealFascinated - lee xo
 */
export const toHumanReadableTime = (time: number, short = false) => {
    if (time < 0) time = -time;
    const result = [];
    let remainingMs = time;

    for (const { unit, shortUnit, ms: unitMs } of TIME_UNITS) {
        const count = Math.floor(remainingMs / unitMs);
        if (count > 0) {
            result.push(`${count}${short ? shortUnit : " " + unit}`);
            remainingMs -= count * unitMs;
        }
        // Stop after two units have been added
        if (result.length === 2) break;
    }

    return result.join(", ") || "0s";
};

/**
 * Converts a date-time to a human-readable string.
 *
 * @param time the date to convert
 * @returns the date-time string
 */
export const toDateTime = (time: DateTime) =>
    time.toLocaleString(DateTime.DATETIME_SHORT);
