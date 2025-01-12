import { Box, PasswordInput, Popover, Progress, Text } from '@mantine/core';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export const PASSWORD_REQUIREMENTS = [
	{ re: /^.{6,}$/, label: 'Mengandung Setidaknya' },
	{ re: /[0-9]/, label: 'Mengandung Angka' },
	{ re: /[a-z]/, label: 'Mengandung Huruf Kecil' },
	{ re: /[A-Z]/, label: 'Mengandung Huruf Besar' },
];

export default function MyPasswordInput(props: CustomInputProps) {
	const [popoverOpened, setPopoverOpened] = useState(false);
	const [value, setValue] = useState(props.defaultValue || '');

	const handleOnChange = (value: string) => {
		setValue(value);
		if (props.onChange) props.onChange(value);
	};

	const strength = getStrength(value);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

	return (
		<Popover
			opened={popoverOpened}
			transitionProps={{ transition: 'pop-top-left' }}
			shadow="sm"
			width="target"
		>
			<Popover.Target>
				<div
					onFocusCapture={() => setPopoverOpened(true)}
					onBlurCapture={() => setPopoverOpened(false)}
				>
					<PasswordInput
						radius="sm"
						placeholder="Kata sandi"
						autoComplete="new-password"
						label="Kata Sandi"
						value={value}
						error={props.error}
						onChange={(event) =>
							handleOnChange(event.currentTarget.value)
						}
					/>
				</div>
			</Popover.Target>
			<Popover.Dropdown>
				<Progress color={color} value={strength} size={5} mb="xs" />

				{PASSWORD_REQUIREMENTS.map((requirement, index) => (
					<PasswordRequirement
						key={index}
						label={requirement.label}
						meets={requirement.re.test(value)}
					/>
				))}
			</Popover.Dropdown>
		</Popover>
	);
}

interface PasswordRequirement {
	meets: boolean;
	label: string;
}

function PasswordRequirement({ meets, label }: PasswordRequirement) {
	return (
		<Text
			c={meets ? 'teal' : 'red'}
			style={{ display: 'flex', alignItems: 'center' }}
			mt={7}
			size="sm"
		>
			{meets ? <CheckIcon size="14" /> : <XIcon size="14" />}
			<Box ml={10}>{label}</Box>
		</Text>
	);
}

function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	PASSWORD_REQUIREMENTS.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(
		100 - (100 / (PASSWORD_REQUIREMENTS.length + 1)) * multiplier,
		10
	);
}
