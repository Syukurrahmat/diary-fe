import { ActionIcon, Alert, AlertProps, Group, rem, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'; //prettier-ignore
import { EllipsisIcon, PenIcon, Sparkles } from 'lucide-react';
import moment from 'moment';
import { useMemo } from 'react';
import LucideIconLazy from '../LucideIconLazy';
import CreateSummaryModal from './CreateSummary';
import styles from './SummaryCard.module.css';

interface TrackerCard extends AlertProps {
	data: JournalItem;
}

export default function TrackerCard({ data, ...p }: TrackerCard) {
	const dontShowtTracker = moment(data.date).isAfter(moment({ hour: 20 }));

	if (dontShowtTracker) return null;

	return data.summary ? (
		<SummaryInfo data={data} {...p} />
	) : (
		<UnFilledTracker date={data.date} {...p} />
	);
}

function SummaryInfo({ data, ...p }: TrackerCard) {
	const HabitList = useMemo(
		() =>
			data.habits.map((e) => (
				<Tooltip label={e.name} key={e.id} openDelay={300}>
					<ThemeIcon radius="xl" variant="outline" size={rem(44)} p="6">
						<LucideIconLazy name={e.icon as any} />
					</ThemeIcon>
				</Tooltip>
			)),
		[data.habits]
	);

	return (
		<Alert
			classNames={styles}
			variant="light"
			color="blue"
			radius='0'
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
			<Text size="sm">{data.summary?.content}</Text>
			{!!data.habits.length && (
				<Stack mt="md">
					<Group justify="center">{HabitList}</Group>
					<Text size="sm" c="dimmed">
						<Text c="dark" fw="600" component="span">
							Kamu Telah :
						</Text>{' '}
						{data.habits.map((e) => e.name).join(', ')}
					</Text>
				</Stack>
			)}
		</Alert>
	);
}

function UnFilledTracker({ date, ...p }: { date: string } & AlertProps) {
	return (
		<Alert
			classNames={styles}
			variant="light"
			color="orange"
			title="Catat keseluruhan Harimu"
			radius='0'
			icon={<PenIcon />}
			{...p}
		>
			<Text size="sm">
				Bagaimana harimu hari ini? Tuliskan ringkasan kegiatan, cerita seru,
				atau perasaanmu di sini
			</Text>
			<CreateSummaryModal date={date} />
		</Alert>
	);
}
