import { Menu, rem, Text } from '@mantine/core';

import { ActionIcon, Badge, Group, Space, Stack, StackProps, Title } from '@mantine/core'; //prettier-ignore
import { Edit3Icon, EllipsisIcon, Trash2Icon } from 'lucide-react';
import moment from 'moment';
import EntryImagesSlider from '../Entry/EntryImagesSlider';
import style from './entry.module.css';

export function EntryWrapper(props: StackProps) {
	return <Stack className={style.wrapper} {...props} />;
}

export function Entry({ data }: { data: EntryItem }) {
	return (
		<div className={style.item}>
			<div className={style.bulletWrapper}>
				<div className={style.bullet} />
				<div className={style.line} />
			</div>

			<Stack gap="4" flex="1">
				<Stack gap="4">
					<Group justify="space-between" wrap="nowrap" align="start">
						<Title h={rem(24)} size="lg" fw="600" c="blue.5">
							{moment(data.datetime).format('HH:mm')}
						</Title>
						<EntryMenu />
					</Group>
					{!!data.location?.address && (
						<Text
							size="calc(0.9 * var(--mantine-font-size-sm))"
							c="dimmed"
							lineClamp={1}
							children={data.location?.address}
						/>
					)}
				</Stack>

				<Stack gap="sm">
					<Text children={data.content} />
					{!!data.images.length && (
						<EntryImagesSlider images={data.images} />
					)}
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

function EntryMenu() {
	return (
		<Menu shadow="md" width={200} position="bottom-end">
			<Menu.Target>
				<ActionIcon
					size={rem(24)}
					color="gray"
					variant="transparent"
					className="entriMenuIcon"
					radius="sm"
					children={<EllipsisIcon size="20" />}
				/>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item leftSection={<Edit3Icon size="16" />}>Ubah</Menu.Item>
				<Menu.Item c="red" leftSection={<Trash2Icon size="16" />}>
					Hapus
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}
