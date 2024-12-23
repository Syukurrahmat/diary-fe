import { Box, Button, Center, Grid, rem } from '@mantine/core'; //prettier-ignore
import moment, { Moment } from 'moment';
import styles from './calender.module.css';

type CalenderEntriesData = {
	dateHasEntries: string;
	image?: string;
};
interface MonthlyCalender {
	year: number;
	month: number;
	data?: CalenderEntriesData[];
	onDayClick: (date: Moment) => void;
}

export function MonthlyCalender({
	year,
	month,
	data,
	onDayClick,
}: MonthlyCalender) {
	const monthMoment = moment([year, month]);
	const daysInMonth = monthMoment.daysInMonth();
	const startDay = monthMoment.startOf('month').day();

	const map = new Map<string, CalenderEntriesData>();
	data?.forEach((e) => map.set(e.dateHasEntries, e));

	const today = moment().startOf('d');

	const calendarDays = Array.from(
		{ length: startDay + daysInMonth },
		(_, i) => {
			if (i < startDay) return null;
			const date = moment([year, month, i - startDay + 1]);
			const entry = map.get(date.format('YYYY-MM-DD'));
			return {
				date: date,
				isToday: date.isSame(today),
				hasEntries: Boolean(entry),
				isFuture: date.isAfter(new Date()),
				image: entry?.image,
			};
		}
	);

	return (
		<Grid columns={7} gutter="6">
			{calendarDays.map((e, index) => (
				<Grid.Col span={1} key={index}>
					{e && (
						<Button
							classNames={{ root: styles.dayCell }}
							onClick={() => onDayClick(e.date)}
							variant="light"
							color={e.hasEntries ? 'blue' : 'gray'}
							disabled={e.isFuture}
							data-entries={e.hasEntries}
						>
							{!!e.image && (
								<Box
									className={styles.dayCellImage}
									style={{ backgroundImage: `url(${e.image})` }}
								/>
							)}
							<Center
								className={styles.dayCellText}
								data-image={!!e.image}
								fz="md"
								children={e.date.date()}
							/>
						</Button>
					)}
				</Grid.Col>
			))}
		</Grid>
	);
}

interface MonthList {
	year: number;
	onItemClick: (v: number) => any;
}

export function MonthList({ year, onItemClick }: MonthList) {
	return (
		<Grid columns={3} gutter="6">
			{moment.months('MMMM').map((e, i) => (
				<Grid.Col span={1} key={e}>
					<Button
						variant="subtle"
						color="gray"
						c="dark"
						h={rem(40)}
						fullWidth
						onClick={() => onItemClick(i)}
						disabled={moment([year, i]).isAfter(new Date())}
						children={e}
					/>
				</Grid.Col>
			))}
		</Grid>
	);
}

interface YearList {
	decade: number;
	onItemClick: (v: number) => void;
}

export function YearList({ decade, onItemClick }: YearList) {
	return (
		<Grid columns={3} gutter="6">
			{Array(10)
				.fill(decade)
				.map((year, i) => (
					<Grid.Col span={1} key={year + i}>
						<Button
							variant="subtle"
							color="gray"
							c="dark"
							h={rem(40)}
							fullWidth
							onClick={() => onItemClick(year + i)}
							disabled={moment([year + i]).isAfter(new Date())}
							children={year + i}
						/>
					</Grid.Col>
				))}
		</Grid>
	);
}
