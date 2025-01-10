import {
	Alert,
	Button,
	Collapse,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PasswordInputWithStrengthMeter, {
	PASSWORD_REQUIREMENTS,
} from '../../components/input/PasswordInput';
import { useAuthContext } from '../../lib/Auth/authContext';

type SubmitingState = 'idle' | 'loading' | 'fail';

export default function Register() {
	// const navigate = useNavigate();
	const { isAuthenticated } = useAuthContext();

	const [submitingState, setSubmitingState] = useState<SubmitingState>('idle');

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			name: '',
			password: '',
			confirmPassword: '',
		},
		onValuesChange: () => setSubmitingState('idle'),
		validate: {
			name: (value) =>
				value.trim().length > 3 ? null : 'Nama harus lebih dari 3 karakter',
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) =>
				PASSWORD_REQUIREMENTS.every((req) => req.re.test(value))
					? null
					: 'Belum Memenuhi',
			confirmPassword: (value, values) =>
				value === values.password ? null : 'Kata Sandi harus sama',
		},
	});

	if (isAuthenticated) return <Navigate to="/" />;

	const onSubmit = form.onSubmit((value) => {
		setSubmitingState('loading');
		console.log(value);
	});

	return (
		<form onSubmit={onSubmit}>
			<Stack gap="0" mb="xl">
				<Title size="h2">Daftar Sekarang</Title>
				<Title c="gray.5" size="h2">
					Mulai Arsipkan Kegiatan-kegiatanmu
				</Title>
			</Stack>
			<Stack gap="md">
				<TextInput
					label="Name"
					radius="sm"
					autoComplete="name"
					placeholder="Tulis Nama Kamu"
					key={form.key('name')}
					{...form.getInputProps('name')}
				/>
				<TextInput
					label="Email"
					radius="sm"
					autoComplete="email"
					placeholder="your@email.com"
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInputWithStrengthMeter
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<PasswordInput
					radius="sm"
					placeholder="Tulis Ulang Kata sandi"
					label="Tulis Ulang Kata sandi"
					key={form.key('confirmPassword')}
					{...form.getInputProps('confirmPassword')}
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
					<Text size="sm">Sudah Punya Akun ?</Text>
					<Link to="/auth/signin">
						<Button variant="subtle" size="compact-sm">
							Masuk Sekarang
						</Button>
					</Link>
				</Group>
			</Stack>
		</form>
	);
}
