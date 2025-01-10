import { Container, Stack } from '@mantine/core'; //prettier-ignore
import CalenderPicker from '../../components/Calender/CalenderPicker';

export default function Calender() {
	return (
		<Container component={Stack} py="xs" px='sm' size="sm">
			<CalenderPicker />
		</Container>
	);
}
