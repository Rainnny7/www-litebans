import Image from "next/image";
import { type ReactElement } from "react";
import { STEVE_AVATAR } from "~/common/player";
import { cn } from "~/common/utils";

const PlayerAvatar = ({
    avatar,
    className,
}: {
    avatar: string | undefined;
    className?: string;
}): ReactElement => (
    <Image
        className={cn(className)}
        src={avatar ?? STEVE_AVATAR}
        alt="Player Avatar"
        width={22}
        height={22}
        draggable={false}
    />
);
export default PlayerAvatar;
