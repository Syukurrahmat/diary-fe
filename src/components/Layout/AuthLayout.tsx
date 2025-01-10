import { Container, Group, ThemeIcon, Title } from '@mantine/core';
import { NotebookTabsIcon } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
	return (
		<Container fluid bg="#f8f9fa" mih="100dvh" px="0">
			<Group p="md" gap="xs" wrap="nowrap">
				<ThemeIcon
					variant="transparent"
					children={<NotebookTabsIcon size="24" />}
				/>
				<Title component="h2" c="blue" size="h3" children="Lelana" />
			</Group>

			<Container size="xs" py="lg">
				<Outlet />
			</Container>
		</Container>
	);
}
