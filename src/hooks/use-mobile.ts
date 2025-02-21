import { useEffect, useState } from "react";

/**
 * The screen sizes.
 */
export enum ScreenSize {
    ExtraSmall = 475,
    Small = 640,
    Medium = 768,
    Large = 1024,
    ExtraLarge = 1280,
    ExtraExtraLarge = 1536,
}

/**
 * A hook to check if the screen
 * size is a given size or larger.
 *
 * @param size the size to check
 * @returns whether the screen size is the same or larger
 */
export const useIsScreenSize = (size = ScreenSize.Medium): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList: MediaQueryList = window.matchMedia(
            `(max-width: ${size - 1}px)`
        );
        const targetSize = Number(size);
        const onChange = () => setIsMobile(window.innerWidth < targetSize);
        mediaQueryList.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < targetSize);
        return () => mediaQueryList.removeEventListener("change", onChange);
    }, [size]);

    return isMobile;
};
