import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { createRoot } from 'react-dom/client';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';
import Layout from './App.tsx';
import './styles/index.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.tsx';
import { SWRConfig } from 'swr';
import { fetcher } from './lib/fetcher.ts';

const theme = createTheme({
	fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
	defaultRadius: 'md',
});

const router = () =>
	createBrowserRouter([
		{
			path: '/',
			element: <Layout />,
			children: [
				{ path: '/', element: <Home /> },
				// { path: '/create', element: <CreateNoteDrawer /> },
				{ path: '/calendar', element: 'calender' },
				{ path: '/profile', element: 'profile' },
				{ path: '/tracker', element: 'tracker' },
			],
		},
	]);

createRoot(document.getElementById('root')!).render(
	<SWRConfig value={{ fetcher, revalidateIfStale: false }}>
		<MantineProvider theme={theme}>
			<RouterProvider router={router()} fallbackElement="qq" />
		</MantineProvider>
	</SWRConfig>
);