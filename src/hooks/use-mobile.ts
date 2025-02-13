import { useEffect, useState } from "react";

export enum ScreenSize {
    ExtraSmall = 475,
    Small = 640,
    Medium = 768,
    Large = 1024,
    ExtraLarge = 1280,
    ExtraExtraLarge = 1536,
}

export const useIsMobile = (size = ScreenSize.Medium) => {
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
