import {
	ActionIcon,
	Box,
	Button,
	Group,
	Stack,
	TextInput,
	Title,
} from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { ICreateFormSection } from '../../../types/additional';

export default function DatetimeSection({ form }: ICreateFormSection) {

	return (
		<Stack gap="0" h="100%">
			<Box p="md" flex="1">
				<Group gap="xs" wrap="nowrap">
					<ActionIcon
						variant="subtle"
						radius="sm"
						ml="-4px"
						onClick={() => form.setFieldValue('section', 'main')}
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
			<Group
				className="borderTop"
				pos="sticky"
				bottom={0}
				bg="white"
				p="sm"
				justify="end"
				pt="md"
			>
				<Button
					onClick={() => form.setFieldValue('section', 'main')}
					children="Oke"
				/>
			</Group>
		</Stack>
	);
}
