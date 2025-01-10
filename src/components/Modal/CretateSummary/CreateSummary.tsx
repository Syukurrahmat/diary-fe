import { Box, Button, Group, Modal, Text, Textarea } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import moment from 'moment';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModelDiscloure } from '../../../lib/hooks';
import { useAppContext } from '../../../lib/useAppContext';
import { getSlideSectionProps } from '../../../lib/utils';
import styles from '../../../styles/myModal.module.css';
import { LoadingToast } from '../../LoadingToast';
import HabitsSelector from './HabitSelector';

export default function CreateSummaryModal({ date }: { date: string }) {
	const { fetcher } = useAppContext();
	const [opened, { open }] = useModelDiscloure(false);
	const [section, setSection] = useState<'main' | 'summary'>('main');
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			summary: '',
			habits: [] as string[],
		},
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
	});

	const onSubmit = form.onSubmit(async (values) => {
		navigate(-1);
		setTimeout(() => {
			form.reset();
			setSection('main');
		}, 250);

		const loadingToast = LoadingToast('Memposting');

		const { summary: content, habits } = values;

		fetcher
			.post('/journals', {
				content,
				habits: habits.map((e) => +e),
				date: moment(date).startOf('d').toDate(),
			})
			.then(() => loadingToast.success('Berhasil di posting'))
			.catch(() => loadingToast.failed('Gagal di posting'));
	});

	return (
		<>
			<Button
				onClick={open}
				mt="xs"
				w="fit-content"
				color="orange"
				variant="light"
			>
				Tambah Ringkasan
			</Button>
			<Modal
				title="Buat Ringkasan"
				opened={opened}
				size="lg"
				transitionProps={{ duration: 250, transition: 'fade-up' }}
				onClose={() => navigate(-1)}
				classNames={styles}
			>
				<form onSubmit={onSubmit}>
					<AnimatePresence mode="popLayout" initial={false}>
						{section == 'main' && (
							<motion.div {...getSlideSectionProps('main')} key="main">
								<Box>
									<Box px="md" pt="md">
										<Text fw="600" mb="lg" ta="center">
											Apa yang telah kamu lakukan hari ini
										</Text>
									</Box>
									<Box p="md">
										<HabitsSelector
											key={form.key('habits')}
											{...form.getInputProps('habits')}
										/>
									</Box>
									<Group
										justify="end"
										className="borderTop"
										p="sm"
									>
										<Button onClick={() => setSection('summary')}>
											Lanjut
										</Button>
									</Group>
								</Box>
							</motion.div>
						)}
						{section == 'summary' && (
							<motion.div
								{...getSlideSectionProps('summary')}
								key="summary"
							>
								<Box>
									<Box px="md" py="md">
										<Text fw="600" mb="lg" ta="center">
											Tulis Apa Saja yang menarik pada hari ini
										</Text>
										<Textarea
											placeholder="Tulis di sini xixixi"
											radius="sm"
											autosize
											minRows={5}
											key={form.key('summary')}
											{...form.getInputProps('summary')}
										/>
									</Box>

									<Group
										justify="space-between"
										className="borderTop"
										p="sm"
									>
										<Button
											variant="default"
											color="gray"
											onClick={() => setSection('main')}
											children="Kembali"
										/>
										<Button
											type="submit"
											disabled={
												form.getValues().summary.trim().length <= 0
											}
											children="Simpan"
										/>
									</Group>
								</Box>
							</motion.div>
						)}
					</AnimatePresence>
				</form>
			</Modal>
		</>
	);
}
