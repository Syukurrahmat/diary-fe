import { BackgroundImage, Button, Center, Grid, Group, Indicator, Loader, Paper, rem, Stack, Title } from '@mantine/core'; //prettier-ignore
import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import useSWR from 'swr';

interface DisplayCalender {
	monthMoment: Moment;
}

type CalenderEntriesData = {
	dateHasEntries: string;
	image?: string;
};

export default function DisplayMonthCalender({ monthMoment }: DisplayCalender) {
	const [year, month] = monthMoment.format('YYYY-MM').split('-');

	const { data } = useSWR<CalenderEntriesData[]>(
		`/journals/calender?month=${month}&year=${year}`
	);

	const calendarDays = useMemo(() => {
		const daysInMonth = monthMoment.daysInMonth();
		const startDay = monthMoment.startOf('month').day();

		const map: Record<string, CalenderEntriesData> = {};
		data?.forEach(
			(entry) => (map[entry.dateHasEntries.split('-')[2]] = entry)
		);

		const today = moment().startOf('d');

		return Array.from({ length: startDay + daysInMonth }, (_, i) => {
			if (i < startDay) return null;

			const day = i - startDay + 1;
			const entry = map[day];

			return {
				day: day,
				hasEntries: !!entry,
				images: entry?.image,
				isToday: moment(`${year}-${month}-${day}`).isSame(today),
			};
		});
	}, [data, month, monthMoment, year]);

	return (
		<Stack gap="xs">
			<Paper
				justify="space-between"
				component={Group}
				wrap="nowrap"
				withBorder
				p="md"
			>
				<Title size="lg" fw="600">
					{monthMoment.format('MMMM YYYY')}
				</Title>
				{!data && <Loader size="xs" />}
			</Paper>
			<Paper withBorder>
				<Grid
					gutter="xs"
					py="sm"
					px="md"
					columns={7}
					className="borderedModalHeader"
				>
					{moment.weekdaysShort().map((day, index) => (
						<Grid.Col span={1} key={index}>
							<Center c="gray.6" fz='sm'>{day}</Center>
						</Grid.Col>
					))}
				</Grid>
				<Grid gutter="xs" p="md" columns={7}>
					{calendarDays.map((day, index) => (
						<Grid.Col span={1} key={index}>
							{day && (
								<Button
									fw="normal"
									h={rem(40)}
									fullWidth
									variant={day.hasEntries ? 'light' : 'subtle'}
									color={day.hasEntries ? 'blue' : 'dark'}
									radius="sm"
									p="0"
									px="0"
									// children={day.day}
								>
									{day.day}
								</Button>
							)}
							{day?.isToday && (
								<Indicator size="6" position="bottom-center" />
							)}
						</Grid.Col>
					))}
				</Grid>
			</Paper>
		</Stack>
	);
}
