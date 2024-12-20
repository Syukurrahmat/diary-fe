import { ActionIcon, Box, Group, Paper, Stack, Timeline, Title } from '@mantine/core'; //prettier-ignore
import { Share2Icon, SortAscIcon, SortDescIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import useSWR from 'swr';
import { relativeDay } from '../../lib/utils';
import Entry from './Entry';
import { fetcher } from '../../lib/fetcher';

export default function DailyContainer() {
	const { data } = useSWR<JournalList[]>('/journals', fetcher, {
		revalidateIfStale: true,
	});

	if (!data) return 'loading';

	return (
		<Stack gap="md">
			{data.map((journal) => (
				<DaylyJournal data={journal} key={journal.date} />
			))}
		</Stack>
	);
}

function DaylyJournal({ data }: { data: JournalList }) {
	const [isReversed, setIsReversed] = useState(false);

	return (
		<Paper key={data.date} withBorder>
			<Group
				justify="space-between"
				p="md"
				style={{
					borderBlockEnd: `1px solid var(--mantine-color-gray-2)`,
				}}
			>
				<Title size="h4">{relativeDay(data.date)}</Title>
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
			<Box pos="relative">
				<Timeline
					active={99999}
					bulletSize={14}
					p="md"
					pl="lg"
					lineWidth={2}
				>
					{(isReversed
						? data.entries.slice().reverse()
						: data.entries
					).map((entry) => (
						<Timeline.Item
							key={entry.id}
							title={moment(entry.datetime).format('HH:mm')}
							children={<Entry data={entry} />}
						/>
					))}
				</Timeline>
			</Box>
		</Paper>
	);
}
