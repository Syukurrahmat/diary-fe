import { Center, Loader, Stack } from '@mantine/core';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { scrollToElementWithOffset } from '../../lib/utils';
import {
	generateInitialQuarterList,
	halfQuarterCount,
	QUARTER_LIMIT,
} from './calendarLib';
import QuarterItem from './QuarterCalender';

export default function InfiniteCalender() {
	const refMonth = moment().startOf('m');
	const [visibility, setVisibility] = useState(false);
	const [isLoadMore, setIsLoadMore] = useState(false);
	const [quarterList, setQuarterList] = useState(
		generateInitialQuarterList(refMonth)
	);

	const containerRef = useRef<HTMLDivElement>(null);

	const endMonthIndex = quarterList.length - 1;
	const showBottomLoader = quarterList[endMonthIndex]
		.clone()
		.endOf('Q')
		.isBefore(moment().startOf('M'));

	const loadMoreData = (at: 'top' | 'bottom') => {
		if (isLoadMore) return;
		setIsLoadMore(true);

		setQuarterList((prev) => {
			if (at == 'top') {
				const fisrt = prev[0];
				const newMonth = Array.from({ length: halfQuarterCount }, (_, i) =>
					fisrt.clone().subtract(halfQuarterCount - i, 'Q')
				);

				return [...newMonth, ...prev].slice(0, QUARTER_LIMIT);
			} else {
				const last = prev[prev.length - 1];
				const newMonth = Array.from({ length: halfQuarterCount }, (_, i) =>
					last.clone().add(i + 1, 'Q')
				);

				return [...prev, ...newMonth].slice(-QUARTER_LIMIT);
			}
		});
		setIsLoadMore(false);
	};

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			const initialFocusEL = container.querySelector(
				`[data-month="${refMonth.format('YYYY-MM')}"]`
			);
			scrollToElementWithOffset(initialFocusEL, 65);
		}
		setVisibility(true);
	}, []);

	return (
		<Stack
			ref={containerRef}
			style={{ visibility: visibility ? 'visible' : 'hidden' }}
		>
			<Center px="md" children={<Loader type="dots" />} />

			{quarterList.map((e, i) => (
				<QuarterItem
					quarter={e}
					key={e.valueOf()}
					onVisible={
						i === 0
							? () => loadMoreData('top')
							: i == endMonthIndex
							? () => loadMoreData('bottom')
							: undefined
					}
				/>
			))}

			{showBottomLoader && (
				<Center px="md" children={<Loader type="dots" />} />
			)}
		</Stack>
	);
}
