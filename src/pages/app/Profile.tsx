import { Button, Container, Stack } from '@mantine/core';
import { useState } from 'react';
import { useAuthContext } from '../../lib/Auth/authContext';
import { mutate } from 'swr';

export default function Profile() {
	const { signOut, fetcher } = useAuthContext();
	const [isSignOuting, setIsSignOuting] = useState(false);

	const onClick = () => {
		setIsSignOuting(true);

		fetcher
			.post('/auth/signout', {}, { withCredentials: true })
			.then(() => {
				mutate(() => true, null, { revalidate: false });
				signOut();
			})
			.finally(() => setIsSignOuting(false));
	};
	return (
		<Container py="xs" px="sm" size="sm">
			<Stack>
				<Button loading={isSignOuting} onClick={onClick}>
					log out
				</Button>
			</Stack>
		</Container>
	);
}
