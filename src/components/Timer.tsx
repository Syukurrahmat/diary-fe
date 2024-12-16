import { rem, Title, TitleProps } from '@mantine/core';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { durationToHHMMSS } from '../lib/utils.ts';

interface Timer extends TitleProps {
	startTime: Date;
}

export function useStopwatch(startTime: Date) {
	const getDuration = () => moment.duration(moment().diff(startTime));
	const [duration, setDuration] = useState(getDuration);

	useEffect(() => {
		const interval = setInterval(() => setDuration(getDuration()), 1000);
		return () => clearInterval(interval);
	}, [startTime]);

	return {
		duration,
		durationStr: duration ? durationToHHMMSS(duration) : undefined,
	};
}

export function useTimer(startTime: Date, duration: number, onEnd: () => any) {
	const endTime = useMemo(
		() => moment(startTime).add(duration, 's').toDate(),
		[startTime, duration]
	);
	const getRemaining = () => {
		const rem = moment.duration(moment(endTime).diff(moment()));
		if (rem.asSeconds() <= 0) onEnd();
		return rem;
	};
	const [remaining, setRemaining] = useState(getRemaining());

	useEffect(() => {
		const interval = setInterval(() => setRemaining(getRemaining()), 100);
		return () => clearInterval(interval);
	}, [endTime]);

	return {
		remaining,
		remainingStr: remaining ? durationToHHMMSS(remaining) : undefined,
	};
}

interface Stopwatch extends TitleProps {
	duration: number;
}

export function Stopwatch({ duration, ...props }: Stopwatch) {
	const endDate = useMemo(() => moment().add(duration, 'second'), []);
	const getDuration = () => moment.duration(moment(endDate).diff(moment()));

	const [durationw, setDuration] = useState<moment.Duration>(getDuration());

	useEffect(() => {
		const interval = setInterval(() => {
			setDuration(getDuration);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<Title
			ta="center"
			fz={rem(125)}
			component="p"
			{...props}
			children={durationToHHMMSS(durationw)}
		/>
	);
}
