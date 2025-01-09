import { AxiosInstance } from "axios";
import { createContext, useContext } from "react";

type AuthContext = {
    signIn: (accessToken: string, refreshToken: string) => void
    signOut: () => void,
    isAuthenticated: boolean,
    fetcher: AxiosInstance
    Authorization : string
}

export const AuthContext = createContext<AuthContext>(null as any)
export const useAuthContext = () => useContext(AuthContext)