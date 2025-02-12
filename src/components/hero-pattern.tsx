import { type ReactElement } from "react";
import { GridPattern } from "~/components/ui/grid-pattern";

const HeroPattern = (): ReactElement => (
    <div className="pointer-events-none absolute inset-0 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFAA00] to-[#F27C00] opacity-10 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#FFAA00]/30 dark:to-[#F27C00]/30 dark:opacity-100">
                <GridPattern
                    width={72}
                    height={56}
                    x={-12}
                    y={4}
                    squares={[
                        [4, 3],
                        [2, 1],
                        [7, 3],
                        [10, 6],
                    ]}
                    className="dark:fill-white/2.5 absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:stroke-white/5"
                />
            </div>
        </div>
    </div>
);
export default HeroPattern;
