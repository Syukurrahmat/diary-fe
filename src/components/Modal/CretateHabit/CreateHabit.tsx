import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModelDiscloure } from '../../../lib/hooks';
import { getRandomItem } from '../../../lib/utils';
import modalStyles from '../../../styles/myModal.module.css';
import { ICON_LIST } from '../../IconList.';
import MyColorInput, { TEMPLATE_COLOR_LIST } from './ColorInput';
import { MyIconInput } from './IconInput';

export default function CreateHabit() {
	const [opened, { open }] = useModelDiscloure(false);
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			name: '',
			color: getRandomItem(TEMPLATE_COLOR_LIST),
			icon: getRandomItem(ICON_LIST),
		},
		onSubmitPreventDefault: 'always',
		validate: {
			name: (v) => (v.trim().length <= 0 ? 'Harus Diisi' : null),
		},
	});

	const onSubmit = form.onSubmit(async (values) => {
		// navigate(-1);
		// setTimeout(() => {
		// 	form.reset();
		// }, 250);

		alert(JSON.stringify(values));
	});

	return (
		<>
			<Button onClick={open} leftSection={<PlusIcon />}>
				Habit Baru
			</Button>
			<Modal
				title="Buat Habit Baru"
				opened={opened}
				size="lg"
				transitionProps={{ duration: 250, transition: 'fade-up' }}
				onClose={() => navigate(-1)}
				classNames={modalStyles}
			>
				<form onSubmit={onSubmit}>
					<Stack p="md">
						<TextInput
							label="Nama habit"
							key={form.key('name')}
							{...form.getInputProps('name')}
						/>
						<MyIconInput
							color={form.getValues().color}
							key={form.key('icon')}
							{...form.getInputProps('icon')}
						/>
						<MyColorInput
							key={form.key('color')}
							{...form.getInputProps('color')}
						/>
					</Stack>
					<Group justify="end" className="borderTop" bg="white" p="sm">
						<Button variant="default" children="Batal" />
						<Button type="submit" children="Buat" />
					</Group>
				</form>
			</Modal>
		</>
	);
}
