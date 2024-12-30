import { AxiosInstance } from "axios";
import { createContext, useContext } from "react";

type AuthContext = {
    signIn: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
    isAuthenticated: boolean,
    fetcher: AxiosInstance
}

export const AuthContext = createContext<AuthContext>(null as any)
export const useAuthContext = () => useContext(AuthContext)