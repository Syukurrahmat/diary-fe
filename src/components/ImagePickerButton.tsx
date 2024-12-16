import { ActionIcon, ActionIconProps } from '@mantine/core';
import { CameraIcon, ImageIcon } from 'lucide-react';
import { useRef } from 'react';

interface CameraButton extends ActionIconProps {
	onAddFile: (e: File) => void;
}

export function CameraButton({ onAddFile, ...p }: CameraButton) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<input
				ref={inputRef}
				style={{ display: 'none' }}
				type="file"
				name="image"
				onChange={(e) => {
					const { files } = e.target;
					if (files?.length) onAddFile(files[0]);
				}}
				accept="image/*"
				capture="environment"
			/>
			<ActionIcon
				variant="transparent"
				c="gray"
				children={<CameraIcon />}
				{...p}
				onClick={() => inputRef.current?.click()}
			/>
		</>
	);
}

interface GaleryButton extends ActionIconProps {
	onAddFiles: (e: File[]) => void;
}

export function GaleryButton({ onAddFiles, ...p }: GaleryButton) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<input
				ref={inputRef}
				style={{ display: 'none' }}
				type="file"
				onChange={(e) => {
					const { files } = e.target;
					if (files?.length) onAddFiles(Array.from(files));
				}}
				multiple
				accept="image/*,video/*"
			/>
			<ActionIcon
				variant="transparent"
				c="gray"
				children={<ImageIcon />}
				{...p}
				onClick={() => inputRef.current?.click()}
			/>
		</>
	);
}
