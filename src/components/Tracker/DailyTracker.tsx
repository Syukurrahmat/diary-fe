import {
	Divider,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useRef } from 'react';
import HabitCheckbox from '../input/HabitCheckbox';
import LucideIconLazy from '../LucideIconLazy';
import CreateHabit from '../Modal/CretateHabit/CreateHabit';
import EditHabit from '../Modal/EditHabit/EditHabit';

export default function DailyTracker({ data }: { data: Habit[] }) {
	return (
		<Stack gap="sm">
			<Title size="h4" c="gray.8">
				Habit Hari ini
			</Title>
			<Stack gap="6">
				{data?.map((e) => (
					<HabitsItem data={e} key={e.id} />
				))}
			</Stack>
			<Divider />
			<Header />
		</Stack>
	);
}

function Header() {
	return (
		<Group justify="end" gap="sm">
			<EditHabit />
			<CreateHabit />
		</Group>
	);
}

function HabitsItem({ data }: { data: Habit }) {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<Paper
			withBorder
			component={Group}
			p="xs"
			gap="sm"
			onClick={() => ref.current?.click()}
			style={{ userSelect: 'none' }}
		>
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
			<HabitCheckbox
				onClick={(e) => e.stopPropagation()}
				ref={ref}
				color={data.color}
			/>
		</Paper>
	);
}
