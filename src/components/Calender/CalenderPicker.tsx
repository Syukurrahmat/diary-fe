import { ActionIcon, Box, Button, ButtonProps, Group, Loader, Paper, Stack } from '@mantine/core'; //prettier-ignore
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment, { Moment, unitOfTime } from 'moment';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { qs } from '../../lib/utils';
import { MonthList, MonthlyCalender, YearList } from './Picker';
import { DATE_FACTOR } from '../../lib/constants';

type CalenderEntriesData = {
	dateHasEntries: string;
	image?: string;
};

const PrevButton = ActionIcon.withProps({
	size: 'lg',
	variant: 'subtle',
	color: 'gray',
	children: <ChevronLeftIcon />,
});

const LabelButton = ({
	loading,
	children,
	...props
}: ButtonProps & React.DOMAttributes<HTMLButtonElement>) => (
	<Button flex="1" variant="subtle" color="gray" fz="md" c="dark" {...props}>
		<Box pos="relative" px="28px">
			{children}
			{loading && (
				<Loader
					pos="absolute"
					right={0}
					bottom={0}
					top={0}
					my="auto"
					size="18px"
				/>
			)}
		</Box>
	</Button>
);

const NextButton = ActionIcon.withProps({
	size: 'lg',
	variant: 'subtle',
	color: 'gray',
	children: <ChevronRightIcon />,
});

export default function CalenderPicker() {
	const [mode, setMode] = useState<'decade' | 'year' | 'month'>('month');

	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth());
	const [decade, setDecade] = useState(Math.floor(year / 10) * 10);

	const navigate = useNavigate();

	const query =
		mode == 'decade'
			? qs({ decade })
			: mode == 'year'
			? qs({ year })
			: qs({ year, month: (month + 1).toString().padStart(2, '0') });

	const { data } = useSWR<CalenderEntriesData[]>(
		query && '/journals/calender?' + query
	);

	const onMonthChange = (month: number) => {
		if (month >= 12) setYear((e) => e + 1);
		if (month < 0) setYear((e) => e - 1);
		setMonth((12 + month) % 12);
		setMode('month');
	};

	const onYearChange = (year: number) => {
		setDecade(Math.floor(year / 10) * 10);
		setYear(year);
		setMode('year');
	};

	const getIsPrevButtonDisabled = useCallback(
		(level: unitOfTime.StartOf, arr: number[]) =>
			moment(arr)
				.startOf(level)
				.isSameOrBefore(moment([1980]).utc(true).startOf(level)),
		[]
	);

	const getIsNextButtonDisabled = useCallback(
		(level: unitOfTime.StartOf, dateArr: number[]) =>
			moment(dateArr).endOf(level).isSameOrAfter(moment().endOf(level)),
		[]
	);

	const onDayClick = (date: Moment) => {
		navigate('./' + date.utc(true).valueOf() / DATE_FACTOR, {state : 123});
	};

	return (
		<Stack gap="xs" className="myCalender">
			<Paper
				withBorder
				px="sm"
				py="8"
				gap="xs"
				justify="space-between"
				component={Group}
				wrap="nowrap"
			>
				{mode === 'month' && (
					<>
						<PrevButton
							onClick={() => onMonthChange(month - 1)}
							disabled={getIsPrevButtonDisabled('month', [year, month])}
						/>
						<LabelButton loading={!data} onClick={() => setMode('year')}>
							{moment([year, month]).format('MMMM YYYY')}
						</LabelButton>
						<NextButton
							onClick={() => onMonthChange(month + 1)}
							disabled={getIsNextButtonDisabled('month', [year, month])}
						/>
					</>
				)}
				{mode === 'year' && (
					<>
						<PrevButton
							onClick={() => onYearChange(year - 1)}
							disabled={getIsPrevButtonDisabled('year', [year])}
						/>
						<LabelButton
							loading={!data}
							onClick={() => setMode('decade')}
						>
							{year}
						</LabelButton>
						<NextButton
							onClick={() => onYearChange(year + 1)}
							disabled={getIsNextButtonDisabled('year', [year])}
						/>
					</>
				)}
				{mode === 'decade' && (
					<>
						<PrevButton
							onClick={() => setDecade((e) => e - 10)}
							disabled={getIsPrevButtonDisabled('year', [decade - 10])}
						/>
						<LabelButton loading={!data}>
							{`${decade} – ${decade + 9}`}
						</LabelButton>
						<NextButton
							onClick={() => setDecade((e) => e + 10)}
							disabled={getIsNextButtonDisabled('year', [decade + 10])}
						/>
					</>
				)}
			</Paper>

			<Paper withBorder p="sm">
				{mode === 'month' && (
					<MonthlyCalender
						onDayClick={onDayClick}
						year={year}
						month={month}
						data={data}
					/>
				)}
				{mode === 'year' && (
					<MonthList year={year} onItemClick={onMonthChange} />
				)}
				{mode === 'decade' && (
					<YearList decade={decade} onItemClick={onYearChange} />
				)}
			</Paper>
		</Stack>
	);
}
