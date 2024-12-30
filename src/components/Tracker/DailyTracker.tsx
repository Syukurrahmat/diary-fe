import {
	Box,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import LucideIconLazy from '../LucideIconLazy';
import HabitCheckbox from '../input/HabitCheckbox';
import { useRef } from 'react';

export default function DailyTracker({ data }: { data: Habit[] }) {
	return (
		<Box>
			<Title size="h4" c="gray.8" mb="sm">
				Habit Hari ini
			</Title>
			<Stack gap="xs">
				{data?.map((e) => (
					<HabitsItem data={e} key={e.id} />
				))}
			</Stack>
		</Box>
	);
}

function HabitsItem({ data }: { data: Habit }) {
	const reff = useRef<HTMLInputElement>(null);
	return (
		<Paper
			withBorder
			component={Group}
			p="xs"
			gap='sm'
			onClick={() => reff.current?.click()}
			style={{ userSelect: 'none' }}
		>
			<ThemeIcon
				color={data.color}
				variant="light"
				radius="sm"
				size="lg"
				children={<LucideIconLazy name={data.icon as any} size='22' />}
			/>
			<Text flex="1" fz='sm'>{data.name}</Text>
			<HabitCheckbox
				onClick={(e) => e.stopPropagation()}
				ref={reff}
				color={data.color}
			/>
		</Paper>
	);
}
