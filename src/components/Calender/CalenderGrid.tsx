import { ActionIcon, Box, Button, Center, Grid, Group, Loader, Paper, PaperProps, Title } from '@mantine/core'; //prettier-ignore
import { InfoIcon } from 'lucide-react';
import { Moment } from 'moment';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnceInViewport } from '../../lib/utils';
import styles from './calender.module.css';
import { generateCalenderGrid } from './calendarLib';

interface MonthlyCalender extends PaperProps {
	month: Moment;
	onceInViewport?: boolean;
	dataLoaded?: boolean;
	data?: { day: string; sampleImage: string }[];
	onVisible?: (entry: IntersectionObserverEntry) => void;
}

export function CalenderGrid(props: MonthlyCalender) {
	const { month, onceInViewport, onVisible, dataLoaded, data, ...p } = props;

	const navigate = useNavigate();
	const { ref } = useOnceInViewport({ threshold: [0, 0.8], onVisible });
	const calendarDays = useMemo(
		() => generateCalenderGrid(month, data),
		[month, data]
	);

	return (
		<Paper
			ref={ref}
			withBorder
			className="fluid-Paper"
			data-month={month.format('YYYY-MM')}
			{...p}
		>
			<Group p="md" className="borderBottom" justify="space-between">
				<Title c="gray.8" size="lg">
					{month.format('MMMM YYYY')}
				</Title>
				{dataLoaded ? (
					<ActionIcon
						size="sm"
						variant="transparent"
						color="gray"
						children={<InfoIcon />}
					/>
				) : (
					<Loader size="sm" color="gray" />
				)}
			</Group>
			<Grid columns={7} gutter="6" p="md">
				{calendarDays.map((e, index) => (
					<Grid.Col span={1} key={index}>
						{e && (
							<Button
								classNames={{ root: styles.dayCell }}
								onClick={() =>
									navigate('/calendar/' + month.format('YYYY-MM-DD'))
								}
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
		</Paper>
	);
}
