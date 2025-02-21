"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { isAuthorized } from "~/actions/is-authorized";

const Protected = ({
    children,
}: Readonly<{ children: ReactNode }>): ReactElement | undefined => {
    const { user } = useUser();
    const [authorized, setAuthorized] = useState<boolean>(false);

    // Check if the user is authorized to access the resource
    useEffect(() => {
        if (!user) return;
        const checkAuth = async () => {
            setAuthorized(
                user ? await isAuthorized({ userId: user.id }) : false
            );
        };
        checkAuth();
    }, [user]);

    return authorized ? <>{children}</> : undefined;
};

export default Protected;
