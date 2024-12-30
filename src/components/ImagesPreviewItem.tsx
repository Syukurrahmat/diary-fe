import { CloseButton, Paper } from '@mantine/core';

export default function ImagesPreviewItem({
	file,
	onDelete,
}: {
	file: File;
	onDelete?: () => void;
}) {
	return (
		<Paper
			pos="relative"
			radius="sm"
			withBorder
			w="100%"
			h="100%"
			style={{ overflow: 'hidden' }}
		>
			{file.type.startsWith('video/') ? (
				<video
					src={URL.createObjectURL(file)}
					style={{
						width: '100%',
						height: '100%',
					}}
				/>
			) : (
				<img
					loading="lazy"
					src={URL.createObjectURL(file)}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			)}
			<CloseButton
				pos="absolute"
				bg="gray.7"
				radius="xl"
				size="24"
				c="white"
				opacity={0.9}
				top="4px"
				p="1"
				right="4px"
				onClick={onDelete}
			/>
		</Paper>
	);
}
