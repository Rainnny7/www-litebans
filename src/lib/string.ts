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
 * Convert a Minecraft formatted string to colored spans
 *
 * @param text The text containing Minecraft color codes
 * @returns JSX elements with appropriate colors
 */
export const formatMinecraftString = (text: string): ReactElement[] => {
    const parts = text.split(/(§[0-9a-fk-or])/);
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
