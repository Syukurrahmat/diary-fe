import { AppShell, Box, Container, Group, Title } from '@mantine/core'; //prettier-ignore
import { Calendar, House, Images, MapIcon, TagIcon, User } from 'lucide-react'; //prettier-ignore
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom'; //prettier-ignore
import { useAppContext } from '../../lib/useAppContext';
import CreateEntryProvider from '../CreateEntry/CreateEntry';
import NavBar from './NavBar';

export const navList = [
	{ Icon: House, label: 'Beranda', to: '/' },
	{ Icon: Calendar, label: 'Kalender', to: '/calendar' },
	{ Icon: Images, label: 'Galeri', to: '/galery' },
	{ Icon: TagIcon, label: 'Tags', to: '/tags' },
	{ Icon: MapIcon, label: 'Atlas', to: '/maps' },
	{ Icon: User, label: 'Profil', to: '/profile' },
];

export default function Layout() {
	const { pinned } = useAppContext();

	const headerLabelMap = useMemo(() => {
		const map = new Map();
		navList.map((e) => map.set(e.to.slice(1), e.label));
		return map;
	}, []);

	return (
		<AppShell
			navbar={{ width: 200, breakpoint: 'sm' }}
			header={{ height: 50, collapsed: !pinned, offset: false }}
			footer={{ height: 52 }}
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
					<Outlet />
				</AppShell.Main>
				<NavBar />
			</CreateEntryProvider>
		</AppShell>
	);
}
