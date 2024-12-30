import { Checkbox, CheckboxProps } from '@mantine/core';
import { forwardRef } from 'react';

export default forwardRef(function HabitCheckbox(
	{ color, ...p }: { color: string } & CheckboxProps,
	ref
) {
	return (
		<Checkbox
			ref={ref as any}
			style={{ '--color': color }}
			classNames={{ input: 'custom-checkbox' }}
			color={color}
			icon={() => null}
			size="lg"
			{...p}
		/>
	);
});
