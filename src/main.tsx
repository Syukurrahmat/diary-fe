import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';
import 'moment/dist/locale/id';
import './styles/index.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { fetcher } from './lib/fetcher.ts';
import moment from 'moment';
import { Notifications } from '@mantine/notifications';
import { router } from './Router.tsx';
import AppProvider from './components/AppContext.tsx';

moment.locale('id');

const theme = createTheme({
	defaultRadius: 'md',
	fontFamily: '"Open Sans", sans serif',
});

createRoot(document.getElementById('root')!).render(
	<SWRConfig value={{ fetcher }}>
		<MantineProvider theme={theme}>
			<Notifications />
			<AppProvider>
				<RouterProvider router={router} fallbackElement="qq" />
			</AppProvider>
		</MantineProvider>
	</SWRConfig>
);
