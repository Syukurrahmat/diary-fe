import { Container } from '@mantine/core';
import InfiniteCalender from '../../components/Calender/InfiniteCalender';

export default function Calender() {
	return (
		<Container py="xs" px={{ base: '0px', xs: 'sm' }} size="sm">
			<InfiniteCalender />
		</Container>
	);
}
