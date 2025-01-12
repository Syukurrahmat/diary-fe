import { Box, CheckIcon, ColorSwatch, Group, Input } from '@mantine/core'; //prettier-ignore
import { useState } from 'react';
import colorSwatchStyle from './ColorSwatchRadio.module.css';

export const TEMPLATE_COLOR_LIST = [
	'#fa5252',
	'#e64980',
	'#be4bdb',
	'#7950f2',
	'#4c6ef5',
	'#228be6',
	'#15aabf',
	'#12b886',
	'#40c057',
	'#82c91e',
	'#fab005',
	'#fd7e14',
	'#868e96',
];

export default function MyColorInput(props: CustomInputProps) {
	const { value, onChange } = props;
	const [color, setColor] = useState(value);

	const handleColorChange = (selectedColor: string) => {
		setColor(selectedColor);
		if (onChange) onChange(selectedColor);
	};

	return (
		<Box>
			<Input.Label mb="4">Warna</Input.Label>
			<Group gap="xs" justify="center">
				{TEMPLATE_COLOR_LIST.map((e) => (
					<ColorSwatch
						className={colorSwatchStyle.button + ' mantine-active'}
						size="35"
						component="button"
						type="button"
						radius="sm"
						color={e}
						children={
							<CheckIcon
								size="20"
								color="white"
								className={colorSwatchStyle.checked}
							/>
						}
						key={e}
						data-checked={e === color}
						onClick={() => handleColorChange(e)}
					/>
				))}
			</Group>
		</Box>
	);
}
