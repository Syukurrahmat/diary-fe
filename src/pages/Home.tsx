import { ActionIcon, Affix, Avatar, Center, Container, Group, Loader, Paper, rem, Stack, Transition } from '@mantine/core'; //prettier-ignore
import { PlusIcon } from 'lucide-react';
import useSWR from 'swr';
import { useCreateEntryModal } from '../components/CreateEntry/CreateEntryContext';
import {
	CameraButton,
	GaleryButton,
} from '../components/input/ImagePickerButton';
import DailyJournal from '../components/Journal/DailyJournal';
import { useAppContext } from '../lib/useAppContext';

export default function Home() {
	const { isSupportCapture, isMobile, pinned } = useAppContext(); //prettier-ignore
	const createModal = useCreateEntryModal();
	const { data } = useSWR<JournalItem[]>('/journals');

	return (
		<Container py="xs" size="sm">
			<Stack gap="xs">
				<Paper
					component={Group}
					wrap="nowrap"
					withBorder
					px="sm"
					py="sm"
					justify="space-between"
					mb="4"
				>
					<Avatar
						tabIndex={0}
						component="button"
						bd="none"
						className="mantine-focus-auto mantine-active"
					/>

					<Center
						className="mantine-active"
						flex="1"
						c="gray.6"
						fz="sm"
						h={rem(36)}
						style={{
							userSelect: 'none',
							justifyContent: 'start',
							cursor: 'pointer',
						}}
						children="Buat Catatan"
						onClick={createModal.open}
					/>
					{isSupportCapture ? (
						<CameraButton
							onAddFile={(e) => {
								createModal.form.insertListItem('images', e);
								createModal.open();
							}}
						/>
					) : (
						<GaleryButton
							onAddFiles={(e) => {
								e.forEach((f) =>
									createModal.form.insertListItem('images', f)
								);
								createModal.open();
							}}
						/>
					)}
				</Paper>

				<Stack gap="md">
					{data ? (
						data.map((journal) => (
							<DailyJournal data={journal} key={journal.date} />
						))
					) : (
						<Center p="md">
							<Loader type="dots" />
						</Center>
					)}
				</Stack>
			</Stack>
			{isMobile && (
				<Affix
					style={{
						zIndex: 100,
						bottom: 'calc(var(--mantine-spacing-md) + 56px)',
						right: 'var(--mantine-spacing-md)',
					}}
				>
					<Transition
						duration={300}
						transition="slide-up"
						mounted={!pinned && !createModal.opened}
					>
						{(transitionStyles) => (
							<ActionIcon
								size="input-lg"
								variant="default"
								c="blue.5"
								style={transitionStyles}
								children={<PlusIcon size="30" />}
								onClick={createModal.open}
							/>
						)}
					</Transition>
				</Affix>
			)}
		</Container>
	);
}
