"use client";

import { type ReactElement, type ReactNode } from "react";
import { useAuth } from "~/providers/auth-provider";

const Protected = ({
    children,
}: Readonly<{ children: ReactNode }>): ReactElement | undefined => {
    const { authorized } = useAuth();
    return authorized ? <>{children}</> : undefined;
};

export default Protected;
