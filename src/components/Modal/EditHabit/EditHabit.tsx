import { Button, Group, Modal } from '@mantine/core'; //prettier-ignore
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useModelDiscloure } from '../../../lib/hooks';
import modalStyles from '../../../styles/myModal.module.css';
import Log from '../../Log';

export default function EditHabit() {
	// const { fetcher } = useAppContext();
	const [opened, { open }] = useModelDiscloure(false);
	const navigate = useNavigate();
	const { data } = useSWR('/habits');

	return (
		<>
			<Button onClick={open} variant="light">
				Edit
			</Button>
			<Modal
				title="Edit Habit Baru"
				opened={opened}
				size="lg"
				transitionProps={{ duration: 250, transition: 'fade-up' }}
				onClose={() => navigate(-1)}
				classNames={modalStyles}
			>
				<Log data={data} />
				<Group justify="end" className="borderTop" bg="white" p="sm">
					<Button variant="default" children="Batal" />
					<Button type="submit" children="Buat" />
				</Group>
			</Modal>
		</>
	);
}
