import { Button, Container, Stack } from '@mantine/core';
import { useAuthContext } from '../lib/Auth/authContext';
import axios from 'axios';
import { API_URL } from '../lib/constants';

export default function Profile() {
	const { signOut } = useAuthContext();

	return (
		<Container py="xs" size="sm">
			<Stack>
				<Button
					onClick={() => {
						axios.post(
							API_URL + '/auth/signin',
							{
								email: 'syukurtullah@gmail.com',
								password: 'Sj03k03r',
							},
							{
								withCredentials: true,
							}
						)
						// fetch(API_URL + '/auth/signin', {
						// 	credentials: 'include',
						// 	method: 'POST',
						// 	body: JSON.stringify({
						// 		email: 'syukurtullah@gmail.com',
						// 		password: 'Sj03k03r',
						// 	}),
						// })
						// 	.then((e) => e.json())
							.then(console.log);
					}}
				>
					login
				</Button>
				<Button
					onClick={() =>
						axios
							.post(API_URL + '/auth/refresh', null, {
								withCredentials: true,
							})
							.then(signOut)
					}
				>
					logout
				</Button>
			</Stack>
		</Container>
	);
}
