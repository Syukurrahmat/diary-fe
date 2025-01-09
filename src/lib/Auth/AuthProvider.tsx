import { Box } from '@mantine/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { API_URL } from '../constants';
import { AuthContext } from './authContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [auth, setAuth, removeAuth] = useCookies(['access', 'refresh']);
	const [isAuthenticated, setIsAuthenticated] = useState(Boolean(auth.access));

	const signIn = useCallback(
		(accessToken: string, refreshToken: string) => {
			const payloadAccessToken = jwtDecode(accessToken);
			const payloadRefreshToken = jwtDecode(refreshToken);

			setAuth('access', accessToken, {
				secure: true,
				expires: new Date(payloadAccessToken.exp! * 1000),
			});
			setAuth('refresh', refreshToken, {
				secure: true,
				expires: new Date(payloadRefreshToken.exp! * 1000),
			});

			console.log('djdjddjj');
			setIsAuthenticated(true);
		},
		[setAuth]
	);

	const signOut = useCallback(() => {
		removeAuth('access');
		removeAuth('refresh');
		setIsAuthenticated(false);
	}, [removeAuth]);

	const fetcher = useMemo(() => {
		const myAxios = axios.create({
			baseURL: API_URL,
			headers: {
				Authorization: `Bearer ${auth.access}`,
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
						signIn(accessToken, refreshToken);
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
	}, [auth.access, auth.refresh, signIn]);

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				isAuthenticated,
				fetcher,
				Authorization: 'Bearer' + auth.access,
			}}
			children={children}
		/>
	);
}
