import { ActionIcon, Box, Button, Checkbox, CheckboxGroupProps, Group, Modal, rem, Skeleton, Stack, Text, Textarea } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon } from 'lucide-react';
import moment from 'moment';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAppContext } from '../../lib/useAppContext';
import { getSlideSectionProps } from '../../lib/utils';
import styles from '../../styles/myModal.module.css';
import { HabbitChip } from '../input/HabbitChip';
import { LoadingToast } from '../LoadingToast';
import LucideIconLazy from '../LucideIconLazy';

export default function CreateSummaryModal({ date }: { date: string }) {
	const { fetcher } = useAppContext();

	const [opened, { open, close }] = useDisclosure(false, {
		onOpen: () => {
			window.history.pushState(null, '', window.location.href);
			window.addEventListener('popstate', close);
		},
		onClose: () => {
			window.removeEventListener('popstate', close);
		},
	});

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
				onClick={() => {
					open();
				}}
				mt="xs"
				mb="4"
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
										className="borderedModalFooter"
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
										className="borderedModalFooter"
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

function HabitsSelector(props: Partial<CheckboxGroupProps>) {
	const { data } = useSWR<Habit[]>('/habits', {
		revalidateIfStale: false,
	});

	const HabitList = useMemo(
		() =>
			data?.map((habit) => (
				<HabbitChip
					key={habit.id}
					color={habit.color}
					value={habit.id.toString()}
					icon={<LucideIconLazy name={habit.icon as any} />}
					label={habit.name}
				/>
			)),
		[data]
	);

	return (
		<Checkbox.Group {...props}>
			<Group justify="center" gap="sm">
				{HabitList ? (
					<>
						{HabitList}
						<Stack flex="1" align="center" gap="4" px="xs" py="4px">
							<ActionIcon
								radius="xl"
								component="label"
								variant="default"
								color="gray"
								c="gray"
								size="xl"
								children={<PlusIcon size="22" />}
							/>
							<Text size="sm" fw="600" c="gray">
								Baru
							</Text>
						</Stack>
					</>
				) : (
					Array(8)
						.fill(null)
						.map((_, i) => (
							<Stack key={i} px="xs" py="4px" align="center" gap="6px">
								<Skeleton h={rem(44)} w={rem(44)} circle />
								<Skeleton h="md" radius="xs" w="56px" />
							</Stack>
						))
				)}
			</Group>
		</Checkbox.Group>
	);
}
