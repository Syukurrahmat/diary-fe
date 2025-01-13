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
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [requestQueue, setRequestQueue] = useState<any[]>([]);

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
	}, []);

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
		});

		myAxios.interceptors.response.use(
			(response) => response,
			(error) => {
				const originalRequest = error.config;

				if (error.response?.status !== 401 || originalRequest._retry) {
					return Promise.reject(error);
				}

				if (isRefreshing) {
					return new Promise((resolve, reject) =>
						setRequestQueue((e) => [...e, { resolve, reject }])
					)
						.then((newToken) => {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
							return myAxios(originalRequest);
						})
						.catch((err) => Promise.reject(err));
				}

				originalRequest._retry = true;
				setIsRefreshing(true);

				console.log('refreshing');

				refressRequest()
					.then((response) => {
						const { accessToken } = response.data.data;
						signIn(accessToken);

						// Jalankan semua request dalam antrean dengan token baru
						myAxios.defaults.headers.Authorization = `Bearer ${accessToken}`;

						requestQueue.forEach((request) =>
							request.resolve(accessToken)
						);
						setRequestQueue([]);
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;

						console.log('refreshing success');
						return myAxios(originalRequest);
					})
					.catch((refreshError) => {
						console.error('Failed to refresh token.', refreshError);

						requestQueue.forEach((request) =>
							request.reject(refreshError)
						);
						setRequestQueue([]);
						setIsAuthenticated(false);
						return Promise.reject(refreshError);
					})
					.finally(() => {
						setIsRefreshing(false);
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
