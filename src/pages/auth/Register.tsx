import { Alert, Button, Collapse, ComboboxData, Group, PasswordInput, Select, Stack, Text, TextInput, Title } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import axios, { AxiosError } from 'axios';
import { InfoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MyPasswordInput, { PASSWORD_REQUIREMENTS } from '../../components/input/PasswordInput'; //prettier-ignore
import { useAuthContext } from '../../lib/Auth/authContext';
import { API_URL } from '../../lib/constants';
import { handlerFormValidationError } from '../../lib/utils';

type SubmitingState = 'idle' | 'loading' | 'fail';

export default function Register() {
	const [timezones, setTimezone] = useState<ComboboxData>();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthContext();

	const [submitingState, setSubmitingState] = useState<SubmitingState>('idle');

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			name: '',
			timezone: '',
			password: '',
			confirmPassword: '',
		},
		onValuesChange: () => setSubmitingState('idle'),
		validate: {
			name: (value) => value.trim().length > 3 ? null : 'Nama harus lebih dari 3 karakter', //prettier-ignore
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => PASSWORD_REQUIREMENTS.every((req) => req.re.test(value)) ? null : 'Belum Memenuhi', //prettier-ignore
			confirmPassword: (value, values) => value === values.password ? null : 'Kata Sandi harus sama', //prettier-ignore
		},
	});

	useEffect(() => {
		import('../../lib/timezones').then((e) => {
			setTimezone(e.default);
			form.setFieldValue(
				'timezone',
				Intl.DateTimeFormat().resolvedOptions().timeZone
			);
		});
	}, []);

	if (isAuthenticated) return <Navigate to="/" />;

	const onSubmit = form.onSubmit(({ confirmPassword, ...value }) => {
		setSubmitingState('loading');
		axios
			.post(API_URL + '/auth/signup', value)
			.then(() => navigate('/auth/signin'))
			.catch((error: AxiosError) => {
				if (error.response?.status == 400) {
					handlerFormValidationError(error, form);
				}
			})
			.finally(() => setSubmitingState('idle'));
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
					label="Nama"
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
				<Select
					label="Zone Waktu"
					placeholder="Pick value"
					data={timezones || []}
					searchable
					checkIconPosition="right"
					allowDeselect={false}
					comboboxProps={{
						transitionProps: { transition: 'pop-top-left' },
					}}
					nothingFoundMessage={
						timezones ? 'Nothing found...' : 'Loading...'
					}
					key={form.key('timezone')}
					{...form.getInputProps('timezone')}
				/>
				<MyPasswordInput
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
