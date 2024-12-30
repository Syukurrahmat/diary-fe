import { Button, Container, Stack } from '@mantine/core';
import { useAuthContext } from '../lib/Auth/authContext';

export default function Profile() {
	const { signOut } = useAuthContext();

	return (
		<Container py="xs" size="sm">
			<Stack>
				<Button
					onClick={signOut}
				>
					logout
				</Button>
			</Stack>
		</Container>
	);
}
