import { Box, Group, NumberInput, Paper, Space, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import moment from 'moment';
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
						<Group flex="1" gap="sm">
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
							<Space flex="1" />
							<Group gap="xs">
								<NumberInput
									w="80"
									clampBehavior="strict"
									max={moment().year()}
									min={1980}
								/>
							</Group>
						</Group>
						<Box
							style={{
								overflow: 'auto',
							}}
							py="md"
						>
							<HabitHeatmap color={e.color} />
						</Box>
					</Paper>
				))}
			</Stack>
		</Box>
	);
}
