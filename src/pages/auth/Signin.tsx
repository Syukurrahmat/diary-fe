import { Alert, Button, Collapse, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import axios from 'axios';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib/Auth/authContext';
import { API_URL } from '../../lib/constants';

type SubmitingState = 'idle' | 'loading' | 'fail';

export default function Signin() {
	const navigate = useNavigate();
	const { signIn, isAuthenticated } = useAuthContext();

	const [submitingState, setSubmitingState] = useState<SubmitingState>('idle');

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			password: '',
		},
		onValuesChange: () => setSubmitingState('idle'),
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value.trim().length > 1 ? null : 'Harus diisi'),
		},
	});

	const onSubmit = form.onSubmit((value) => {
		setSubmitingState('loading');
		axios
			.post(
				API_URL + '/auth/signin',
				{
					email: value.email,
					password: value.password,
				},
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				signIn(response.data.data.accessToken);
				navigate('/');
				setSubmitingState('idle');
			})
			.catch((e) => {
				console.log(e);
				setSubmitingState('fail');
			});
	});

	if (isAuthenticated) return <Navigate to="/" />;

	return (
		<form onSubmit={onSubmit}>
			<Stack gap="0" mb="xl">
				<Title size="h2">Masuk Sekarang</Title>
				<Title c="gray.5" size="h2">
					Catat apapun yang kamu lakukan
				</Title>
			</Stack>
			<Stack gap="md">
				<TextInput
					label="Email"
					radius="sm"
					autoComplete="email"
					placeholder="your@email.com"
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInput
					radius="sm"
					placeholder="Kata sandi"
					autoComplete="current-password"
					label="Kata Sandi"
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
			</Stack>

			<Collapse in={submitingState == 'fail'}>
				<Alert
					mt="md"
					variant="light"
					fw="500"
					withCloseButton
					onClose={() => setSubmitingState('idle')}
					color="red"
					icon={<InfoIcon />}
				>
					Email atau Kata Sandi yang anda masukkan salah
				</Alert>
			</Collapse>

			<Stack mt="md" gap="xs" align="center">
				<Button
					loading={submitingState == 'loading'}
					fullWidth
					type="submit"
				>
					Lanjut
				</Button>
				<Group gap="0">
					<Text size="sm">Belum Punya Akun ?</Text>
					<Link to='/auth/register'>
						<Button variant="subtle" size="compact-sm">
							Daftar Sekarang
						</Button>
					</Link>
				</Group>
			</Stack>
		</form>
	);
}
