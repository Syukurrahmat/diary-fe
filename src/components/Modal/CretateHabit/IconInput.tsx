import { ActionIcon, Box, Group, Input } from '@mantine/core'; //prettier-ignore
import { useMemo, useState } from 'react';
import { ICON_LIST } from '../../IconList.';
import LucideIconLazy from '../../LucideIconLazy';
import colorSwatchStyle from './ColorSwatchRadio.module.css';

export function MyIconInput(props: CustomInputProps & { color: string }) {
	const { value, onChange, color } = props;

	const iconList = useMemo(
		() =>
			ICON_LIST.map((name) => ({
				name,
				icon: <LucideIconLazy name={name} />,
			})),
		[]
	);

	const [selectedIcon, setSelectedIcon] = useState(value);

	const handleIconChange = (value: string) => {
		setSelectedIcon(value);
		if (onChange) onChange(value);
	};

	return (
		<Box>
			<Input.Label mb="4">Ikon</Input.Label>
			<Group gap="6" justify="center" className={colorSwatchStyle.iconGroup}>
				{iconList.map((icon) => (
					<ActionIcon
						radius="sm"
						className={colorSwatchStyle.icon}
						variant={selectedIcon == icon.name ? 'filled' : 'transparent'}
						color={selectedIcon == icon.name ? color : 'gray'}
						size="40"
						onClick={() => handleIconChange(icon.name)}
						key={icon.name}
						children={icon.icon}
					/>
				))}
			</Group>
		</Box>
	);
}
