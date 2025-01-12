import { ActionIcon, Checkbox, CheckboxGroupProps, Group, rem, Skeleton, Stack, Text } from '@mantine/core'; //prettier-ignore
import { PlusIcon } from 'lucide-react';
import { useMemo } from 'react';
import useSWR from 'swr';
import { HabbitChip } from '../../input/HabbitChip';
import LucideIconLazy from '../../LucideIconLazy';

export default function HabitsSelector(props: Partial<CheckboxGroupProps>) {
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
							<Text size="sm" ta='center' fw="600" c="gray">
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
