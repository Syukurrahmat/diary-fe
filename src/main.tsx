import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'moment/dist/locale/id';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';
import './styles/index.css';

import { createTheme, MantineProvider } from '@mantine/core';
import moment from 'moment';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';
import AppProvider from './App.tsx';
import { fetcher } from './lib/fetcher.ts';
import { router } from './Router.tsx';

moment.locale('id');

const theme = createTheme({
	defaultRadius: 'md',
	fontFamily: '"Open Sans", sans serif',
});

createRoot(document.getElementById('root')!).render(
	<SWRConfig value={{ fetcher }}>
		<MantineProvider theme={theme}>
			<AppProvider>
				<RouterProvider
					future={{ v7_startTransition: true}}
					router={router}
					fallbackElement="qq"
				/>
			</AppProvider>
		</MantineProvider>
	</SWRConfig>
);
