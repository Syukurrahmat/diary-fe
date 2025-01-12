import { Button, Group, Modal, ModalProps, Stack, TextInput } from '@mantine/core'; //prettier-ignore
import { UseFormReturnType } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import modalStyles from '../../../styles/myModal.module.css';
import MyColorInput from './ColorInput';
import { MyIconInput } from './IconInput';

type HabitForm = {
	name: string;
	color: string;
	icon: string;
};

interface HabitModal extends Omit<ModalProps, 'onClose'> {
	form: UseFormReturnType<HabitForm>;
	submitHandler: (event?: React.FormEvent<HTMLFormElement>) => void;
	isSubmiting: boolean;
}

export default function HabitModal({
	form,
	onSubmit,
	submitHandler,
	isSubmiting,
	...props
}: HabitModal) {
	const navigate = useNavigate();
	
	const resetAndClose = () => {
		navigate(-1);
		setTimeout(form.reset, 250);
	};

	return (
		<Modal
			size="lg"
			transitionProps={{ duration: 250, transition: 'fade-up' }}
			classNames={modalStyles}
			{...props}
			onClose={() => navigate(-1)}
		>
			<form onSubmit={submitHandler}>
				<Stack p="md">
					<TextInput
						label="Nama habit"
						key={form.key('name')}
						{...form.getInputProps('name')}
					/>
					<MyColorInput
						key={form.key('color')}
						{...form.getInputProps('color')}
					/>
					<MyIconInput
						color={form.getValues().color}
						key={form.key('icon')}
						{...form.getInputProps('icon')}
					/>
				</Stack>
				<Group justify="end" className="borderTop" bg="white" p="sm">
					<Button
						variant="default"
						onClick={resetAndClose}
						children="Batal"
					/>
					<Button loading={isSubmiting} type="submit" children="Buat" />
				</Group>
			</form>
		</Modal>
	);
}
