import { ActionIcon, Group, Paper, Title } from '@mantine/core'; //prettier-ignore
import { Share2Icon, SortAscIcon, SortDescIcon } from 'lucide-react';
import { useState } from 'react';
import { relativeDay } from '../../lib/utils';
import { Entry, EntryWrapper } from '../Entry/Entry';
import TrackerCard from './TrackerCard';

export default function DaylyJournal({ data }: { data: JournalItem }) {
	const [isReversed, setIsReversed] = useState(false);
	const displayEntries = isReversed
		? data.entries.slice().reverse()
		: data.entries;

	return (
		<Paper key={data.date} withBorder className="daylyJournalPapper">
			<Group justify="space-between" p="md" className="borderedModalHeader">
				<Title size="lg">{relativeDay(data.date)}</Title>
				<Group gap="xs">
					<ActionIcon
						size="sm"
						variant="transparent"
						color="gray"
						onClick={() => {
							setIsReversed((e) => !e);
						}}
						children={isReversed ? <SortDescIcon /> : <SortAscIcon />}
					/>
					<ActionIcon
						size="sm"
						variant="transparent"
						color="gray"
						children={<Share2Icon />}
					/>
				</Group>
			</Group>
			<TrackerCard data={data} />
			<EntryWrapper py="sm">
				{displayEntries.map((e) => (
					<Entry data={e} key={e.id} />
				))}
			</EntryWrapper>
		</Paper>
	);
}
