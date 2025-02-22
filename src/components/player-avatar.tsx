import Image from "next/image";
import { type ReactElement } from "react";
import { STEVE_AVATAR } from "~/common/player";
import { cn } from "~/common/utils";

type PlayerAvatarProps = {
    className?: string;
    avatar: string | undefined;
    size?: number;
};

const PlayerAvatar = ({
    className,
    avatar,
    size = 22,
}: PlayerAvatarProps): ReactElement => (
    <Image
        className={cn(className)}
        src={avatar ?? STEVE_AVATAR}
        alt="Player Avatar"
        width={size}
        height={size}
        draggable={false}
    />
);
export default PlayerAvatar;
