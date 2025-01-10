import { ActionIcon, Box, Group, Paper, Skeleton, Stack, Title } from '@mantine/core'; //prettier-ignore
import { Share2Icon, SortAscIcon, SortDescIcon } from 'lucide-react';
import { useState } from 'react';
import { relativeDay } from '../../lib/utils';
import { Entry, EntryWrapper } from '../Entry/Entry';
import SummaryCard from '../SummaryCard/SummaryCard';

export default function DailyJournal({ data }: { data: JournalItem }) {
	const [isReversed, setIsReversed] = useState(false);
	const displayEntries = isReversed
		? data.entries.slice().reverse()
		: data.entries;

	return (
		<Paper withBorder className="fluid-Paper">
			<Group justify="space-between" p="md" className="borderBottom">
				<Title size="md" fw="600">
					{relativeDay(data.date)}
				</Title>
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
			<SummaryCard
				habits={data.habits}
				date={data.date}
				summary={data.summary}
			/>
			<EntryWrapper py="sm">
				{displayEntries.map((e) => (
					<Entry data={e} key={e.id} />
				))}
			</EntryWrapper>
		</Paper>
	);
}

export function DailyJournalSkeleton({ count = 2 }: { count?: number }) {
	return (
		<>
			{Array(count)
				.fill(null)
				.map((_, i) => (
					<Paper key={i} withBorder className="fluid-Paper" >
						<Box p="md" h="55" className="borderBottom">
							<Skeleton h="lg" w="400" maw='80%' />
						</Box>
						<Stack gap="xl" pb="xl">
							{Array(2)
								.fill(null)
								.map((_, i) => (
									<Group
										key={i}
										align="start"
										py="sm"
										pr="md"
										pl="12.250"
										wrap="nowrap"
									>
										<Skeleton w="15" h="15" mt="4" />
										<Stack gap="xs" w="100%">
											<Skeleton w="100" h="24" />
											<Skeleton w="80%" h="12" />
										</Stack>
									</Group>
								))}
						</Stack>
					</Paper>
				))}
		</>
	);
}
