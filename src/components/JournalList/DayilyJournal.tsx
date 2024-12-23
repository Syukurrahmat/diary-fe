import { ActionIcon, Alert, Box, CheckIcon, Group, Paper, Title } from '@mantine/core'; //prettier-ignore
import { Share2Icon, SortAscIcon, SortDescIcon } from 'lucide-react';
import { useState } from 'react';
import { relativeDay } from '../../lib/utils';
import { Entry, EntryWrapper } from '../Entry/Entry';

export default function DaylyJournal({ data }: { data: JournalList }) {
	const [isReversed, setIsReversed] = useState(false);

	return (
		<Paper key={data.date} withBorder>
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
			<Alert
				radius="0"
				pl="calc(var(--mantine-spacing-md) - 0.25 * 16px)"
				styles={{
					icon: {
						width: '16px',
						marginTop: '2px',
						marginInlineEnd: 'var(--mantine-spacing-xs)',
					},
				}}
				variant="light"
				color="blue"
				title={
					<Title size="lg" fw="600" c="blue.5">
						Ringkasan
					</Title>
				}
				icon={<CheckIcon />}
			>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
				similique non sed repudiandae, quisquam iusto odit nihil animi totam
				quas recusandae aut perferendis beatae in dolor saepe aliquam
				dolores facilis.
			</Alert>
			<Box pos="relative">
				<EntryWrapper py="sm">
					{(isReversed
						? data.entries.slice().reverse()
						: data.entries
					).map((e) => (
						<Entry data={e} key={e.id} />
					))}
				</EntryWrapper>
			</Box>
		</Paper>
	);
}
