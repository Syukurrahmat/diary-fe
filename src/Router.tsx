import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppProvider from './App';
import AuthLayout from './components/Layout/AuthLayout';
import { PrivateRouter } from './lib/Auth/PrivateRouter';
import Register from './pages/auth/Register';
import Signin from './pages/auth/Signin';

const Layout = React.lazy(() => import('./components/Layout/AppLayout'));
const Calender = React.lazy(() => import('./pages/app/Calender'));
const CalenderDateDetail = React.lazy(
	() => import('./pages/app/CalenderDetail')
);
const Home = React.lazy(() => import('./pages/app/Home'));
const Profile = React.lazy(() => import('./pages/app/Profile'));
const Tracker = React.lazy(() => import('./pages/app/Tracker'));

export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <PrivateRouter />,
			children: [
				{
					element: <AppProvider children={<Layout />} />,
					children: [
						{ path: '/', element: <Home /> },
						{ path: '/calendar', element: <Calender /> },
						{ path: '/calendar/:date', element: <CalenderDateDetail /> },
						{ path: '/profile', element: <Profile /> },
						{ path: '/galery', element: 'tracker' },
						{ path: '/tracker', element: <Tracker /> },
						{ path: '/maps', element: 'tracker' },
					],
				},
			],
		},

		{
			path: '/auth',
			element: <AuthLayout />,
			children: [
				{ path: '/auth/signin', element: <Signin /> },
				{ path: '/auth/register', element: <Register /> },
			],
		},
	],
	{
		future: {
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_relativeSplatPath: true,
			v7_skipActionErrorRevalidation: true,
		},
	}
);
