import {
	Box,
	Group,
	Paper,
	ScrollArea,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import LucideIconLazy from '../LucideIconLazy';
import { HabitHeatmap } from './HabitHeatmap';

export default function OverallTracker({ data }: { data: Habit[] }) {
	return (
		<Box>
			<Title size="h4" c="gray.8" mb="md">
				Habitmu Keseluruhan
			</Title>

			<Stack gap="xs">
				{data.map((e) => (
					<Paper key={e.id} p="xs" withBorder>
						<Group flex="1" gap='sm'>
							<ThemeIcon
								color={e.color}
								variant="light"
								radius="sm"
								size="lg"
								children={
									<LucideIconLazy name={e.icon as any} size="22" />
								}
							/>
							<Text flex="1" fz="sm">
								{e.name}
							</Text>
						</Group>
						<ScrollArea py="md">
							<HabitHeatmap color={e.color} />
						</ScrollArea>
					</Paper>
				))}
			</Stack>
		</Box>
	);
}
