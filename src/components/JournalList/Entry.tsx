import { Badge, Box, Group, Stack, Text } from '@mantine/core'; //prettier-ignore
import ImageSlider from '../ImageSlider';

export default function Entry({ data }: { data: SimpleEntryData }) {
	return (
		<Box>
			{!!data.location && (
				<Text
					c="dimmed"
					size="sm"
					lineClamp={1}
					children={data.location.address}
				/>
			)}
			<Stack py="4" gap="sm" pt="4">
				<Text children={data.content} />
				<ImageSlider images={data.images} fluid />
				{!!data.tags.length && (
					<Group gap="xs">
						{data.tags.map((e) => (
							<Badge
								key={e.id}
								radius="sm"
								size="md"
								fz="sm"
								fw="600"
								variant="light"
								tt="capitalize"
								children={e.name}
							/>
						))}
					</Group>
				)}
			</Stack>
		</Box>
	);
}
