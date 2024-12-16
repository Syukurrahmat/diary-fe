import {
	AppShell,
	Button,
	Group,
	NavLink,
	Space,
	Stack,
	Text,
	ThemeIcon,
	useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { NavLink as NavLinkRouter, Outlet } from 'react-router-dom';
import CreateNoteModal from './pages/CreateNote';

import {
	Calendar,
	House,
	Images,
	Map,
	NotebookTabsIcon,
	PlusIcon,
	TagIcon,
	User,
} from 'lucide-react';

const navListLeft = [
	{
		Icon: House,
		label: 'Beranda',
		to: '/',
	},
	{
		Icon: Calendar,
		label: 'Kalender',
		to: '/calendar',
	},
	{
		Icon: Images,
		label: 'Galeri',
		to: '/trackewr',
	},
	{
		Icon: TagIcon,
		label: 'Tags',
		to: '/trackewr',
	},
	{
		Icon: Map,
		label: 'Atlas',
		to: '/trackewr',
	},
	{
		Icon: User,
		label: 'Profil',
		to: '/profile',
	},
];

function Layout() {
	const [opened, { open, close }] = useDisclosure(false);
	const theme = useMantineTheme();

	return (
		<AppShell
			navbar={{
				width: 200,
				breakpoint: 'xs',
			}}
			bg="#fafafa"
		>
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
			<AppShell.Navbar component="nav">
				<Stack p="sm" gap="xs">
					<Group p="sm" gap="xs" wrap="nowrap">
						<ThemeIcon variant="transparent">
							<NotebookTabsIcon />
						</ThemeIcon>
						<Text component="h2" c="blue" fw="600">
							KenKen
						</Text>
					</Group>
					<Space />
					{navListLeft.map(({ to, label, Icon }) => (
						<NavLinkRouter
							style={{
								textDecoration: 'initial',
								color: 'initial',
							}}
							to={to}
							key={to}
						>
							{({ isActive }) => (
								<NavLink
									style={{ borderRadius: theme.radius.md }}
									leftSection={<Icon size="22" />}
									active={isActive}
									label={label}
								/>
							)}
						</NavLinkRouter>
					))}
					<Space />
					<Button onClick={open} leftSection={<PlusIcon size="20" />}>
						Buat Catatan
					</Button>
				</Stack>
			</AppShell.Navbar>
			<CreateNoteModal opened={opened} close={close} />
		</AppShell>
	);
}

export default Layout;
