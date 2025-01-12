import { Alert, Button, Collapse, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import axios, { AxiosError } from 'axios';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib/Auth/authContext';
import { API_URL } from '../../lib/constants';

export default function Signin() {
	const navigate = useNavigate();
	const { signIn, isAuthenticated } = useAuthContext();
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [error, setError] = useState<string>();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			password: '',
		},
		onValuesChange: () => setError(undefined),
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value.trim().length > 1 ? null : 'Harus diisi'),
		},
	});

	const onSubmit = form.onSubmit(({ email, password }) => {
		setIsSubmiting(true);
		setError(undefined);
		axios
			.post(
				API_URL + '/auth/signin',
				{ email, password },
				{ withCredentials: true }
			)
			.then((response) => {
				signIn(response.data.data.accessToken);
				navigate('/');
			})
			.catch((e: AxiosError) => {
				console.log(e.response?.data);
				e.response?.status == 403
					? setError('Email atau Kata Sandi yang anda masukkan salah')
					: setError('Opss... Ada yang salah');
			})
			.finally(() => setIsSubmiting(false));
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

			<Collapse in={!!error}>
				<Alert
					mt="md"
					variant="light"
					fw="500"
					withCloseButton
					onClose={() => setError(undefined)}
					color="red"
					icon={<InfoIcon />}
					children={error}
				/>
			</Collapse>

			<Stack mt="md" gap="xs" align="center">
				<Button loading={isSubmiting} fullWidth type="submit">
					Lanjut
				</Button>
				<Group gap="0">
					<Text size="sm">Belum Punya Akun ?</Text>
					<Link to="/auth/register">
						<Button variant="subtle" size="compact-sm">
							Daftar Sekarang
						</Button>
					</Link>
				</Group>
			</Stack>
		</form>
	);
}
