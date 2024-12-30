import {
	Box,
	Group,
	Paper,
	rem,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import moment from 'moment';
import LucideIconLazy from '../LucideIconLazy';
import HabitCheckbox from '../input/HabitCheckbox';
import styles from './tracker.module.css';

export default function WeeklyTracker({ data }: { data: Habit[] }) {
	return (
		<Box>
			<Title size="h4" c="gray.8" >
				Habit Minggu ini
			</Title>
			<Group visibleFrom="xs" gap='md' px="xs"  justify="end">
				{Array(7)
					.fill(null)
					.map((_, i) => (
						<Text ta='center' key={i} w={rem(32)} fz="xs" c="dimmed">
							{moment.weekdaysMin()[i]}
						</Text>
					))}
			</Group>
			<Stack gap="xs" mt='md'>
				{data?.map((e) => (
					<HabitsItem data={e} key={e.id} />
				))}
			</Stack>
		</Box>
	);
}

function HabitsItem({ data }: { data: Habit }) {
	return (
		<Paper
			withBorder
			component={Group}
			align="stretch"
			className={styles.weeklyTracker}
		>
			<Group flex="1" gap='sm'>
				<ThemeIcon
					color={data.color}
					variant="light"
					radius="sm"
					size="lg"
					children={<LucideIconLazy name={data.icon as any} size="22" />}
				/>
				<Text flex="1" fz="sm">
					{data.name}
				</Text>
			</Group>
			<Group wrap="nowrap" gap="md" justify="space-between" flex="1">
				{Array(7)
					.fill(null)
					.map((_, i) => (
						<Stack key={i} align="center" gap="0">
							<Text hiddenFrom="xs" fz="xs" c="dimmed">
								{moment.weekdaysMin()[i]}
							</Text>
							<HabitCheckbox color={data.color} />
						</Stack>
					))}
			</Group>
		</Paper>
	);
}
