import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { API_URL } from '../constants';
import { AuthContext } from './authContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [auth, setAuth, removeAuth] = useCookies(['auth', 'refresh']);
	const [isAuthenticated, setIsAuthenticated] = useState(Boolean(auth));

	const setAuthValue = useCallback(
		(accessToken: string, refreshToken: string) => {
			const payloadAccessToken = jwtDecode(accessToken);
			const payloadRefreshToken = jwtDecode(refreshToken);

			console.log(
				'kadaluarsa apada' + new Date(payloadAccessToken.exp! * 1000)
			);
			setAuth('auth', accessToken, {
				secure: true,
				expires: new Date(payloadAccessToken.exp! * 1000),
			});
			setAuth('refresh', refreshToken, {
				secure: true,
				expires: new Date(payloadRefreshToken.exp! * 1000),
			});
			setIsAuthenticated(true);
		},
		[setAuth]
	);

	const signIn = useCallback(
		(email: string, password: string) =>
			axios
				.post(API_URL + '/auth/signin', { email, password })
				.then((res) => {
					if (res.status !== 200) throw Error('sss');
					const { accessToken, refreshToken } = res.data.data;
					setAuthValue(accessToken, refreshToken);
				}),
		[setAuthValue]
	);

	const signOut = useCallback(
		() =>
			axios.post(API_URL + '/auth/signout', null).then(() => {
				removeAuth('auth');
				removeAuth('refresh');
				setIsAuthenticated(false);
			}),
		[removeAuth]
	);

	const fetcher = useMemo(() => {
		const myAxios = axios.create({
			baseURL: API_URL,
			headers: {
				Authorization: `Bearer ${auth.auth}`,
				'Content-Type': 'application/json',
			},
			transformResponse: (e) => {
				const response = JSON.parse(e);
				return response.data;
			},
		});
		myAxios.interceptors.response.use(
			(response) => response,
			(error) => {
				const originalRequest = error.config;

				if (error.response?.status !== 401 || originalRequest._retry) {
					return Promise.reject(error);
				}

				originalRequest._retry = true;
				const refreshToken = auth.refresh;
				if (!refreshToken) return Promise.reject(error);

				console.log('refreshing');
				axios
					.post(API_URL + '/auth/refresh', null, {
						headers: {
							Authorization: `Bearer ${auth.refresh}`,
						},
					})
					.then((response) => {
						const { accessToken, refreshToken } = response.data.data;
						setAuthValue(accessToken, refreshToken);
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						console.log('refreshing success');
						return myAxios(originalRequest);
					})
					.catch((refreshError) => {
						console.error('Failed to refresh token.', refreshError);
						setIsAuthenticated(false);
						return Promise.reject(refreshError);
					});
			}
		);
		return myAxios;
	}, [auth.auth, auth.refresh, setAuthValue]);

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				isAuthenticated,
				fetcher,
			}}
			children={children}
		/>
	);
}
