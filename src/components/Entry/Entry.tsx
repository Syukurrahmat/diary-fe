import { ActionIcon, Badge, Box, Group, Space, Stack, StackProps, Text, Title } from '@mantine/core'; //prettier-ignore
import { EllipsisIcon } from 'lucide-react';
import moment from 'moment';
import EntryImagesSlider from '../Entry/EntryImagesSlider';
import style from './entry.module.css';

export function EntryWrapper(props: StackProps) {
	return <Stack className={style.wrapper} {...props} />;
}

export function Entry({ data }: { data: SimpleEntryData }) {
	return (
		<div className={style.item}>
			<div className={style.bulletWrapper}>
				<div className={style.bullet} />
				<div className={style.line} />
			</div>

			<Stack gap="4" flex="1">
				<Stack gap="2">
					<Group justify="space-between">
						<Title size="lg" fw="600" c="blue.5">
							{moment(data.datetime).format('HH:mm')}
						</Title>
						<ActionIcon
							size="md"
							color="gray"
							variant="transparent"
							children={<EllipsisIcon />}
						/>
					</Group>
					<Text size="calc(0.95* var(--mantine-font-size-sm))" c="dimmed">
						{data.location?.address}
					</Text>
				</Stack>
				<Stack gap="sm">
					<Box  fz="sm" children={data.content} />
					<EntryImagesSlider images={data.images} />
					{!!data.tags.length && (
						<Group gap="xs">
							{data.tags.map((e) => (
								<Badge
									key={e.id}
									radius="sm"
									size="lg"
									p="xs"
									fw="600"
									variant="light"
									tt="capitalize"
									children={e.name}
								/>
							))}
						</Group>
					)}
				</Stack>
				<Space py="2" />
			</Stack>
		</div>
	);
}
