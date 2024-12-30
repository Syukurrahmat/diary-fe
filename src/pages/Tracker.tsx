import { Container, SegmentedControl, Stack } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import useSWR from 'swr';
import DailyTracker from '../components/Tracker/DailyTracker';
import WeeklyTracker from '../components/Tracker/WeeklyTracker';
import OverallTracker from '../components/Tracker/OveralTracker';

export default function Tracker() {
	const [value, setValue] = useHash({ getInitialValueInEffect: true });
	const { data } = useSWR<Habit[]>('/habits');

	return (
		<Container py="xs" size="sm">
			<Stack>
				<SegmentedControl
					value={value ? value : '#'}
					onChange={setValue}
					data={[
						{ label: 'Hari ini', value: '#' },
						{ label: 'Mingguan', value: '#week' },
						{ label: 'Keseluruhan', value: '#overall' },
						
					]}
				/>
				{value == '' && <DailyTracker data={data || []} />}
				{value == '#week' && <WeeklyTracker data={data || []} />}
				{value == '#overall' && <OverallTracker data={data || []} />}
			</Stack>
		</Container>
	);
}
