import { Stack } from '@mantine/core';
import moment, { Moment } from 'moment';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CalenderGrid } from './CalenderGrid';

interface QuarterItem {
	quarter: Moment;
	onVisible?: () => void;
}

export type PerQuarterCalenderData = {
	quarter: string;
	data: Record<string, { day: string; sampleImage: string }[]>;
};

export default function QuarterItem({ quarter, onVisible }: QuarterItem) {
	const [onceInViewport, setOnceInViewport] = useState(false);
	const { data } = useSWR<PerQuarterCalenderData>(
		onceInViewport && '/journals/calendar/' + quarter.format('YYYY-MM')
	);

	const onItemVisibleHandle = (
		entry: IntersectionObserverEntry,
		visibleMonth: Moment
	) => {
		if (entry.intersectionRatio >= 0.75) {
			window.location.hash = visibleMonth.format('YYYY-MM');
		}
		setOnceInViewport(true);
		if (onVisible) onVisible();
	};

	const monthList = useMemo(
		() =>
			Array.from({ length: 3 }, (_, i) =>
				quarter.clone().add(i, 'month')
			).filter((e) => e.isBefore(moment())),
		[]
	);

	return (
		<Stack>
			{monthList.map((e) => (
				<CalenderGrid
					key={e.valueOf()}
					month={e}
					data={data?.data[quarter.format('YYYY-MM')]}
					dataLoaded={!!data}
					onceInViewport={onceInViewport}
					onVisible={(entry) => onItemVisibleHandle(entry, e)}
				/>
			))}
		</Stack>
	);
}
