"use client";

import { useUser } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/server";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { isAuthorized } from "~/actions/is-authorized";

/**
 * The props for the auth context.
 */
type AuthContextProps = {
    user: User | undefined;
    authorized: boolean;
};

/**
 * The current context of the auth state.
 */
const AuthContext = createContext<AuthContextProps>({
    user: undefined,
    authorized: false,
});

/**
 * The hook to use the auth context.
 */
export const useAuth = (): AuthContextProps => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
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

    return (
        <AuthContext.Provider
            value={{ user: user as User | undefined, authorized }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;
