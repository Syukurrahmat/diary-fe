import { AppShell, Box, Button, Group, NavLink, Space, Stack, Text, ThemeIcon } from '@mantine/core'; //prettier-ignore
import { NotebookTabsIcon, PlusIcon } from 'lucide-react'; //prettier-ignore
import { NavLink as NavLinkRouter } from 'react-router-dom'; //prettier-ignore
import { useAppContext } from '../../lib/useAppContext';
import { useCreateEntryModal } from '../Modal/CreateEntry/CreateEntryContext';
import { NavList } from './AppLayout';

export default function NavBar({ navList }: { navList: NavList }) {
	const { isMobile } = useAppContext();
	const createEntryModal = useCreateEntryModal();

	return !isMobile ? (
		<AppShell.Navbar component="nav">
			<Stack px="md" gap="6">
				<Group py="md" gap="xs" wrap="nowrap">
					<ThemeIcon size="36" children={<NotebookTabsIcon size="24" />} />
					<Box>
						<Text component="h2" c="blue" fw="600" children="Lelana" />
						<Text fz="xs" lineClamp={1} children="Syukur Rahmatullah" />
					</Box>
				</Group>
				<Space />
				{navList.map(({ to, label, Icon }) => (
					<NavLink
						className="mantine-active radius-md"
						component={NavLinkRouter}
						label={label}
						to={to}
						key={to}
						leftSection={<Icon size="18" />}
					/>
				))}
				<Space />

				<Button
					onClick={createEntryModal.open}
					leftSection={<PlusIcon size="20" />}
					variant="light"
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
			<Group p="sm" wrap="nowrap" h="100%" gap="xs" justify="space-evenly">
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
	);
}
