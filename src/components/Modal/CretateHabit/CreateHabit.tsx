import { Button } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { useModalDiscloure } from '../../../lib/hooks';
import { useAppContext } from '../../../lib/useAppContext';
import { getRandomItem } from '../../../lib/utils';
import { ICON_LIST } from '../../IconList.';
import { failedToast, successToast } from '../../LoadingToast';
import { TEMPLATE_COLOR_LIST } from './ColorInput';
import HabitModal from './HabitModal';

const generateInitialValue = () => ({
	name: '',
	color: getRandomItem(TEMPLATE_COLOR_LIST),
	icon: getRandomItem(ICON_LIST) as string,
});

export default function CreateHabit() {
	const [opened, { open }] = useModalDiscloure(false);
	const navigate = useNavigate();
	const { fetcher } = useAppContext();
	const [isSubmiting, setIsSubmiting] = useState(false);

	const form = useForm({
		initialValues: generateInitialValue(),
		onSubmitPreventDefault: 'always',
		validate: {
			name: (v) => (v.trim().length <= 0 ? 'Harus Diisi' : null),
		},
	});

	const resetAndClose = () => {
		navigate(-1);
		setTimeout(() => {
			form.reset();
			form.setInitialValues(generateInitialValue())
		}, 250);
	};

	const submitHandler = form.onSubmit(async (values) => {
		setIsSubmiting(true);
		fetcher
			.post('/habits', values)
			.then((e) => {
				const { data } = e.data;
				mutate<Habit[]>('/habits', (e) => e && [data, ...e], { revalidate: false}); // prettier-ignore
				successToast('Berhasil membuat habit baru');
				resetAndClose();
			})
			.catch((e) => {
				const fieldError = (e.response.data.message || '').split(':');
				if (fieldError.length == 2) {
					form.setFieldError(fieldError[0], fieldError[1]);
					return;
				}
				failedToast('Opsss. ada yang salah');
			})
			.finally(() => setIsSubmiting(false));
	});

	return (
		<>
			<Button onClick={open} leftSection={<PlusIcon />}>
				Habit Baru
			</Button>
			<HabitModal
				title="Buat Habit Baru"
				submitHandler={submitHandler}
				isSubmiting={isSubmiting}
				opened={opened}
				form={form}
			/>
		</>
	);
}
