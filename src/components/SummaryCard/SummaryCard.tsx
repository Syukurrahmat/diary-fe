import { ActionIcon, Alert, AlertProps, Group, rem, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'; //prettier-ignore
import { EllipsisIcon, PenIcon, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import CreateSummaryModal from '../CretateSummary/CreateSummary';
import LucideIconLazy from '../LucideIconLazy';
import styles from './summaryCard.module.css';

interface TrackerCard extends AlertProps {
	habits: JournalItemHabit[];
	summary?: Summary;
	date: string;
}

export default function SummaryCard({
	habits,
	summary,
	date,
	...p
}: TrackerCard) {
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
			classNames={styles}
			variant="light"
			radius="0"
			color={isComplete ? 'blue' : 'orange'}
			icon={isComplete ? <Sparkles /> : <PenIcon />}
			{...p}
			title={
				<Group justify="space-between">
					Tentang Hari ini
					<ActionIcon
						size={rem(24)}
						color="gray"
						variant="transparent"
						className="entriMenuIcon"
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
							</Text>{' '}
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
	// return data.summary ? (
	// 	<FilledSummary habits={habits} summary={summary} {...p} />
	// ) : (
	// 	<UnfilledSummary date={date} {...p} />
	// );
}

interface FilledSummary extends AlertProps {
	habits: JournalItemHabit[];
	summary: Summary;
}

export function FilledSummary({ habits, summary, ...p }: FilledSummary) {
	const HabitList = useMemo(
		() =>
			habits.map((e) => (
				<Tooltip label={e.name} key={e.id} openDelay={300}>
					<ThemeIcon radius="xl" variant="outline" size={rem(44)} p="6">
						<LucideIconLazy name={e.icon as any} />
					</ThemeIcon>
				</Tooltip>
			)),
		[habits]
	);

	return (
		<Alert
			classNames={styles}
			variant="light"
			color="blue"
			radius="0"
			icon={<Sparkles />}
			{...p}
			title={
				<Group justify="space-between">
					Tentang Hari ini
					<ActionIcon
						size={rem(24)}
						color="gray"
						variant="transparent"
						className="entriMenuIcon"
						radius="sm"
						children={<EllipsisIcon size="20" />}
					/>
				</Group>
			}
		>
			<Text size="sm">{summary?.content}</Text>
			{!!habits.length && (
				<Stack mt="md">
					<Group justify="center">{HabitList}</Group>
					<Text size="sm" c="dimmed">
						{habits.map((e) => e.name).join(', ')}
					</Text>
				</Stack>
			)}
		</Alert>
	);
}
