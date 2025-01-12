import { ActionIcon, Checkbox, Text } from '@mantine/core';
import { ReactNode } from 'react';
import style from './habbitChip.module.css';

export interface HabbitChip {
	icon: ReactNode;
	value: string;
	label: string;
	color: string;
}
export function HabbitChip({ color, icon, value, label }: HabbitChip) {
	return (
		<Checkbox.Card
			flex="1"
			radius="md"
			unstyled
			className={style.root}
			value={value}
			component="div"
			style={{ '--color': color }}
		>
			<ActionIcon
				size="xl"
				radius="xl"
				variant="outline"
				color={color}
				className={style.icon}
			>
				{icon}
			</ActionIcon>
			<Text className={style.label} ta='center' lineClamp={1} size="sm" fw="500" children={label} />
		</Checkbox.Card>
	);
}
