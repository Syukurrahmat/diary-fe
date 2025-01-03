import { AppShell, Box, Center, Container, Group, Loader, Title } from '@mantine/core'; //prettier-ignore
import { Calendar, House, Images, MapIcon, RouteIcon, User } from 'lucide-react'; //prettier-ignore
import { Suspense, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; //prettier-ignore
import { useAppContext } from '../../lib/useAppContext';
import CreateEntryProvider from '../CreateEntry/CreateEntry';
import NavBar from './NavBar';

export const navList = [
	{ Icon: House, label: 'Beranda', to: '/' },
	{ Icon: Calendar, label: 'Kalender', to: '/calendar' },
	{ Icon: Images, label: 'Galeri', to: '/galery' },
	{ Icon: RouteIcon, label: 'Tracker', to: '/tracker' },
	{ Icon: MapIcon, label: 'Atlas', to: '/maps' },
	{ Icon: User, label: 'Profil', to: '/profile' },
];

export default function Layout() {
	const { pinned } = useAppContext();

	const location = useLocation();
	const headerLabelMap = useMemo(() => {
		const map = new Map();
		navList.map((e) => map.set(e.to.slice(1), e.label));
		return map;
	}, []);

	return (
		<AppShell
			navbar={{ width: 200, breakpoint: 'sm' }}
			header={{ height: 50, collapsed: !pinned, offset: false }}
			footer={{ height: 56 }}
			bg="#f8f9fa"
			transitionDuration={300}
			layout="alt"
		>
			<CreateEntryProvider>
				<AppShell.Header
					style={{
						backdropFilter: 'blur(28.5px)',
						background: 'rgb(255 255 255 / 75%)',
					}}
				>
					<Container size="sm" component={Group} h="100%">
						<Title size="h3">
							{headerLabelMap.get(location.pathname.split('/')[1])}
						</Title>
					</Container>
				</AppShell.Header>
				<AppShell.Main>
					<Box h="50px" />

					<Suspense
						fallback={
							<Center flex="1" px="md" mt="30vh">
								<Loader color="gray" size="sm" />
							</Center>
						}
					>
						<Outlet />
					</Suspense>
				</AppShell.Main>
				<NavBar />
			</CreateEntryProvider>
		</AppShell>
	);
}
