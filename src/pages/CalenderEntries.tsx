import { Container, Group, Stack } from '@mantine/core';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import DaylyJournal from '../components/JournalList/DayilyJournal';
import { DATE_FACTOR } from '../lib/constants';

export default function CalenderDate() {
	const param = useParams().date;
	const { data } = useSWR<JournalList[]>('/journals');

	const dd = new Date(+param! * DATE_FACTOR);

	return (
		<Container size="sm" py="xs">
			<Group>{dd.toISOString()}</Group>
			<Stack>
				{data?.map((journal) => (
					<DaylyJournal data={journal} key={journal.date} />
				))}
			</Stack>
		</Container>
	);
}
