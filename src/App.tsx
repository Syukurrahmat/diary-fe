import { AppShell, Box, Button, Container, Group, NavLink, Space, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { Calendar, House, Images, MapIcon, NotebookTabsIcon, PlusIcon, TagIcon, User } from 'lucide-react'; //prettier-ignore
import { useMemo } from 'react';
import { NavLink as NavLinkRouter, Outlet, useLocation } from 'react-router-dom'; //prettier-ignore
import CreateEntryModal from './components/CreateEntry/CreateEntry';
import { useAppContext } from './lib/useAppContext';

const navList = [
	{ Icon: House, label: 'Beranda', to: '/' },
	{ Icon: Calendar, label: 'Kalender', to: '/calendar' },
	{ Icon: Images, label: 'Galeri', to: '/galery' },
	{ Icon: TagIcon, label: 'Tags', to: '/tags' },
	{ Icon: MapIcon, label: 'Atlas', to: '/maps' },
	{ Icon: User, label: 'Profil', to: '/profile' },
];

export default function Layout() {
	const { isMobile, pinned, createEntryControl, createEntryOpened } = useAppContext(); //prettier-ignore
	const headerLabelMap = useMemo(() => {
		const map = new Map();
		navList.map((e) => map.set(e.to.slice(1), e.label));
		return map;
	}, []);

	const location = useLocation();

	return (
		<AppShell
			navbar={{ width: 200, breakpoint: 'sm' }}
			header={{ height: 50, collapsed: !pinned, offset: false }}
			footer={{ height: 52, collapsed: !pinned }}
			bg="#f8f9fa"
			transitionDuration={300}
			layout="alt"
		>
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
			{!isMobile ? (
				<AppShell.Navbar component="nav">
					<Stack p="sm" gap="xs">
						<Group p="sm" gap="xs" wrap="nowrap">
							<ThemeIcon
								variant="transparent"
								children={<NotebookTabsIcon />}
							/>
							<Text component="h2" c="blue" fw="600" children="Lelana" />
						</Group>
						<Space />
						{navList.map(({ to, label, Icon }) => (
							<NavLink
								className="mantine-active"
								component={NavLinkRouter}
								style={{ borderRadius: 'var(--mantine-radius-md)' }}
								label={label}
								to={to}
								key={to}
								leftSection={<Icon size="22" />}
							/>
						))}
						<Space />
						<Button
							onClick={createEntryControl.open}
							leftSection={<PlusIcon size="20" />}
							children="Buat Entri"
						/>
					</Stack>
				</AppShell.Navbar>
			) : (
				<AppShell.Footer
					component="nav"
					className="mobile"
					style={{
						zIndex: 200,
						background: 'rgb(255 255 255 / 75%)',
						backdropFilter: 'blur(28.5px)',
					}}
				>
					<Group
						p="sm"
						wrap="nowrap"
						h="100%"
						gap="xs"
						justify="space-evenly"
					>
						{navList.map(({ to, Icon }) => (
							<NavLink
								component={NavLinkRouter}
								className="mantine-active"
								style={{
									borderRadius: 'var(--mantine-radius-md)',
									display: 'flex',
									width: 'fit-content',
								}}
								styles={{ label: { display: 'flex' } }}
								variant="transparent"
								p="4"
								to={to}
								key={to}
								label={<Icon size="25" />}
							/>
						))}
					</Group>
				</AppShell.Footer>
			)}

			<CreateEntryModal
				opened={createEntryOpened}
				close={createEntryControl.close}
			/>
		</AppShell>
	);
}
