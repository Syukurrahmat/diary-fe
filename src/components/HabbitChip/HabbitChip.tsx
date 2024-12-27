import {
	ActionIcon,
	Checkbox,
	Text
} from '@mantine/core';
import { ReactNode } from 'react';
import style from './habbitChip.module.css';

export interface HabbitChip {
	icon: ReactNode;
	value: string;
	label: string;
}
export function HabbitChip({ icon, value, label }: HabbitChip) {
	return (
		<Checkbox.Card
			radius="md"
			unstyled
			className={style.root}
			value={value}
			component="div"
		>
			<ActionIcon
				size="xl"
				radius="xl"
				variant="outline"
				color="gray"
				className={style.icon}
			>
				{icon}
			</ActionIcon>
			<Text className={style.label}  size="sm" fw="500" children={label} />
		</Checkbox.Card>
	);
}
