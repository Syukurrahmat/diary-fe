import { createBrowserRouter } from 'react-router-dom';
import AppProvider from './App';
import { PrivateRouter } from './lib/Auth/PrivateRouter';
import Signin from './pages/Signin';
import React from 'react';

const Layout = React.lazy(() => import('./components/Layout/Layout'));
const Calender = React.lazy(() => import('./pages/Calender'));
const CalenderDateDetail = React.lazy(() => import('./pages/CalenderDetail'));
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Tracker = React.lazy(() => import('./pages/Tracker'));


export const router = createBrowserRouter([
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
		path: '/signin',
		element: <Signin />,
	},
]);
