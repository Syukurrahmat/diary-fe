import { ActionIcon, Alert, AlertProps, Group, rem, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'; //prettier-ignore
import { Edit3Icon, EllipsisIcon, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import CreateSummaryModal from '../Modal/CretateSummary/CreateSummary';
import LucideIconLazy from '../LucideIconLazy';
import styles from './summaryCard.module.css';

interface TrackerCard extends AlertProps {
	habits: JournalItemHabit[];
	summary?: Summary;
	date: string;
	inJournal?: boolean;
}

export default function SummaryCard(props: TrackerCard) {
	const { habits, summary, date, inJournal = true, ...p } = props;
	const isComplete = Boolean(summary && habits.length);

	const HabitList = useMemo(
		() =>
			habits.map((habit) => (
				<Tooltip label={habit.name} key={habit.id} openDelay={300}>
					<ThemeIcon
						radius="xl"
						color={habit.color}
						variant="filled"
						size={rem(40)}
						p="6"
					>
						<LucideIconLazy name={habit.icon as any} />
					</ThemeIcon>
				</Tooltip>
			)),
		[habits]
	);

	return (
		<Alert
			variant="light"
			radius="0"
			classNames={styles}
			color={isComplete ? 'blue' : 'orange'}
			icon={isComplete ? <Sparkles /> : <Edit3Icon />}
			{...p}
			title={
				<Group justify="space-between">
					Tentang Hari ini
					<ActionIcon
						size={rem(24)}
						color="gray"
						variant="transparent"
						radius="sm"
						children={<EllipsisIcon size="20" />}
					/>
				</Group>
			}
		>
			<Stack>
				{summary && <Text size="sm">{summary.content}</Text>}
				{!!habits.length && (
					<Stack>
						<Group justify="center">{HabitList}</Group>
						<Text size="sm" c="dimmed">
							<Text c="dark" component="span">
								Kamu telah :{' '}
							</Text>
							{habits.map((e) => e.name).join(', ')}
						</Text>
					</Stack>
				)}
				{!summary && (
					<Stack gap="2">
						<Text size="sm">
							Bagaimana harimu hari ini? Tuliskan ringkasan kegiatan,
							cerita seru, atau perasaanmu di sini
						</Text>
						<CreateSummaryModal date={date} />
					</Stack>
				)}
			</Stack>
		</Alert>
	);
}
 