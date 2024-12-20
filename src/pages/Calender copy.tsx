import { Box, Center, Container, Loader, rem, Stack, Title } from '@mantine/core'; //prettier-ignore
import { useScrollIntoView } from '@mantine/hooks';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import DisplayMonthCalender from '../components/Calender/DisplayMonthCalender';

export default function Calender() {
	const [monthList, setMonthList] = useState(
		Array.from({ length: 7 }, (_, i) => moment().add(-3 + i, 'month'))
	);

	const { targetRef, scrollIntoView } = useScrollIntoView<HTMLDivElement>({
		duration: 0,
		offset: 165,
	});

	const onScroll = useCallback(() => {
		const threshold = 400;
		const isOnBottom = document.body.scrollHeight - threshold < window.scrollY + window.innerHeight; //prettier-ignore
		const isOntop = window.scrollY < threshold;

		if (isOntop) {
			setMonthList((e) => {
				const fisrtItem = e[0];
				const newItems = Array.from({ length: 3 }, (_, i) =>
					fisrtItem.clone().subtract(3 - i, 'M')
				);
				return [...newItems, ...e].slice(0, 15);
			});
		}
		if (isOnBottom) {
			setMonthList((e) => {
				const lastItem = e[e.length - 1];
				const newItems = Array.from({ length: 3 }, (_, i) =>
					lastItem.clone().add(i + 1, 'M')
				);

				return [...e, ...newItems].slice(-15);
			});
		}
	}, []);

	useEffect(() => {
		scrollIntoView();
		window.addEventListener('scroll', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, []);

	return (
		<Container component={Stack} py="md" size="sm">
			<Title size="h3" component="h1">
				Kalender
			</Title>
			<Stack gap="xs">
				<Center h={rem(28)}>
					<Loader type="dots" />
				</Center>
				{monthList.map((e, i) => (
					<Box key={e.toISOString()} ref={i == 3 ? targetRef : null}>
						<DisplayMonthCalender monthMoment={e} />
					</Box>
				))}
				<Center h={rem(28)}>
					<Loader type="dots" />
				</Center>
			</Stack>
		</Container>
	);
}

