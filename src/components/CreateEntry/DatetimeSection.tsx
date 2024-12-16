import {
	ActionIcon,
	Box,
	Button,
	Group,
	TextInput,
	Title,
} from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { ICreateFormSection } from '../../types/additional';

export default function DatetimeSection({
	form,
	onChangeSection,
}: ICreateFormSection) {
	return (
		<Box>
			<Box p="md">
				<Group gap="xs" wrap="nowrap">
					<ActionIcon
						variant="subtle"
						radius="sm"
						ml="-4px"
						onClick={() => onChangeSection('main')}
						children={<ArrowLeft size="20" />}
					/>
					<Title size="md" fw="600">
						Atur Tanggal dan waktu
					</Title>
				</Group>

				<Group mt="sm">
					<TextInput
						label="Tanggal"
						type="date"
						flex="1"
						onClick={(e) => e.currentTarget.showPicker()}
						key={form.key('date')}
						{...form.getInputProps('date')}
					/>
					<TextInput
						label="Waktu"
						type="time"
						flex="1"
						onClick={(e) => e.currentTarget.showPicker()}
						key={form.key('time')}
						{...form.getInputProps('time')}
					/>
				</Group>
			</Box>
			<Group pos="sticky" bottom={0} bg="white" p="sm" justify="end" pt="0">
				<Button onClick={() => onChangeSection('main')} children="Oke" />
			</Group>
		</Box>
	);
}
