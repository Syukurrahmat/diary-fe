import {
	AppShell,
	Burger,
	Button,
	Group,
	NavLink,
	Space,
	Stack,
	Text,
	ThemeIcon,
	Title,
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
	const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false); //prettier-ignore
	const [opened, { toggle }] = useDisclosure();
	const theme = useMantineTheme();

	return (
		<AppShell
			navbar={{
				width: 200,
				breakpoint: 'sm',

				collapsed: { mobile: !opened },
			}}
			// header={{ height: 60 }}
			bg="#fafafa"
			layout="alt"
		>
			{/* <AppShell.Header bd='none'>
				<Group h="60" p="sm">
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom="sm"
						size="sm"
					/>
					<Title size="h3" component="h1">
						Journal
					</Title>
				</Group>
			</AppShell.Header> */}
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
					<Button
						onClick={openCreate}
						leftSection={<PlusIcon size="20" />}
					>
						Buat Catatan
					</Button>
				</Stack>
			</AppShell.Navbar>
			<CreateNoteModal opened={createOpened} close={closeCreate} />
		</AppShell>
	);
}

export default Layout;
