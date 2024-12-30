import '@mantine/core/styles.css';
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
import WaitFontWrapper from './components/WaitFontWrapper.tsx';
import AuthProvider from './lib/Auth/AuthProvider.tsx';
import { router } from './Router.tsx';

moment.locale('id');

const theme = createTheme({
	defaultRadius: 'md',
	fontFamily: '"Inter", sans serif',
});

createRoot(document.getElementById('root')!).render(
	<MantineProvider theme={theme}>
		<WaitFontWrapper>
			<AuthProvider>
				<RouterProvider
					future={{ v7_startTransition: true }}
					router={router}
					fallbackElement="qq"
				/>
			</AuthProvider>
		</WaitFontWrapper>
	</MantineProvider>
);
