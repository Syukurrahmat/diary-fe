import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import LoadingScreen from '../../components/LoadingScreen';
import { API_URL } from '../constants';
import { AuthContext } from './authContext';

const refressRequest = () => axios.post(API_URL + '/auth/refresh', null, { withCredentials: true }); //prettier-ignore

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [auth, setAuth, removeAuth] = useCookies(['access']);
	const [isAuthenticated, setIsAuthenticated] = useState(Boolean(auth.access));
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!auth.access) {
			refressRequest()
				.then((response) => {
					const { accessToken } = response.data.data;
					signIn(accessToken);
				})
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, [auth.access]);

	const signIn = useCallback(
		(accessToken: string) => {
			const payloadAccessToken = jwtDecode(accessToken);

			setAuth('access', accessToken, {
				secure: true,
				expires: new Date(payloadAccessToken.exp! * 1000),
			});

			setIsAuthenticated(true);
		},
		[setAuth]
	);

	const signOut = useCallback(() => {
		removeAuth('access');
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

				console.log('refreshing');

				refressRequest()
					.then((response) => {
						const { accessToken } = response.data.data;
						signIn(accessToken);
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						console.log('refreshing success');
						return myAxios(originalRequest);
					})
					.catch((refreshError) => {
						console.error('Failed to refresh token.', refreshError);
						setIsAuthenticated(false);
						window.location.href = '/auth/signin';
						return Promise.reject(refreshError);
					});
			}
		);
		return myAxios;
	}, [auth.access, signIn]);

	if (isLoading) return <LoadingScreen />;

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
