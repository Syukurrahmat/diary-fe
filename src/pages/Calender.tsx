import { Box, Center, Container, Image, Stack, Title } from '@mantine/core'; //prettier-ignore
import { DatePicker, DatePickerProps } from '@mantine/dates';
import 'dayjs/locale/id';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import styles from '../styles/calender.module.css';
import useSWR from 'swr';
import { useDebouncedValue } from '@mantine/hooks';

type CalenderEntriesData = {
	dateHasEntries: string;
	image?: string;
};

export default function Calender() {
	const [calender, setMonth] = useState<Date | null>(new Date());

	const [year, month] = moment(calender).format('YYYY-MM').split('-')

	const { data } = useSWR<CalenderEntriesData[]>(
		`/journals/calender?month=${month}&year=${year}`
	);

	const mappedData = useMemo(() => {
		const map: Record<string, CalenderEntriesData> = {};
		data?.forEach((entry) => (map[entry.dateHasEntries] = entry));
		return map;
	}, [data]);

	const renderDay: DatePickerProps['renderDay'] = (date) => {
		const hasEntries = mappedData[moment(date).format('YYYY-MM-DD')];
		const image = hasEntries?.image;

		return (
			<>
				{image && (
					<Box
						h="100%"
						className={styles.imageDay}
						bg="gray.8"
						pos="absolute"
						top="0"
						style={{ zIndex: -1 }}
					>
						<Image fit="cover" opacity={0.5} h="100%" src={image} />
					</Box>
				)}

				<Center
					h="100%"
					c={hasEntries ? (image ? 'white' : 'blue') : undefined}
					bg={hasEntries && !image ? 'blue.0' : undefined}
					fz="md"
					fw="bold"
					children={date.getDate()}
				/>
			</>
		);
	};

	return (
		<Container component={Stack} py="md" size="sm">
			<Title size="h3" component="h1">
				Kalender
			</Title>
			<DatePicker
				onMonthSelect={setMonth}
				onNextMonth={setMonth}
				onPreviousMonth={setMonth}
				withCellSpacing={false}
				size="md"
				classNames={{
					levelsGroup: styles.levelGroup,
					calendarHeader: styles.header,
					monthsList: styles.content,
					yearsList: styles.content,
					month: styles.content,
					monthsListCell: styles.cell,
					yearsListCell: styles.cell,
					day: styles.day,
					calendarHeaderControl: styles.control,
				}}
				locale="id"
				hideOutsideDates
				previousIcon={<ChevronLeftIcon />}
				nextIcon={<ChevronRightIcon />}
				getDayProps={() => ({
					style: { color: 'initial' },
				})}
				renderDay={renderDay}
				maxDate={moment().toDate()}
			/>
		</Container>
	);
}

