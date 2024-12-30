import axios from "axios";
import createRefresh from "react-auth-kit/createRefresh";
import createStore from "react-auth-kit/createStore";

import { API_URL } from "./lib/constants";


export const refresh = createRefresh({
    interval: 0.5,
    refreshApiCallback: async (param) => {
        try {
            console.log('=================== Refreshing =================== ');
            const response = await axios.post(API_URL + '/auth/refresh', null, {
                headers: { Authorization: `Bearer ${param.refreshToken}` },
            });
            return {
                isSuccess: true,
                newAuthToken: response.data.data.accessToken as string,
                newRefreshToken: response.data.data.refreshToken,
            };
        } catch (error) {
            console.error(error);
            return {
                newAuthToken: '',
                isSuccess: false,
            };
        }
    },
});

export const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: true,
    refresh,
    debug: true,
});