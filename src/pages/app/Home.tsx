import { ActionIcon, Affix, Avatar, Center, Container, Group, Paper, rem, Stack, Text, Transition } from '@mantine/core'; //prettier-ignore
import { PlusIcon } from 'lucide-react';
import useSWR from 'swr';
import { CameraButton, GaleryButton } from '../../components/input/ImagePickerButton'; //prettier-ignore
import DailyJournal, { DailyJournalSkeleton } from '../../components/Journal/DailyJournal'; //prettier-ignore
import { useCreateEntryModal } from '../../components/Modal/CreateEntry/CreateEntryContext';
import { useAppContext } from '../../lib/useAppContext';

export default function Home() {
	const { isSupportCapture, isMobile, pinned } = useAppContext(); //prettier-ignore
	const createModal = useCreateEntryModal();
	const { data } = useSWR<JournalItem[]>('/journals');

	return (
		<Container py="xs" px={{ base: '0px', xs: 'sm' }} size="sm">
			<Stack gap="xs">
				<Paper
					className="fluid-Paper"
					component={Group}
					wrap="nowrap"
					withBorder
					px="sm"
					py="sm"
					justify="space-between"
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

				<Stack gap="sm">
					{data ? (
						data.length ? (
							data.map((journal) => (
								<DailyJournal data={journal} key={journal.date} />
							))
						) : (
							<Paper p="xl" withBorder className="fluid-Paper">
								<Center c='dimmed'>
									Anda belum menulis apapun disini, buat sekarang
								</Center>
							</Paper>
						)
					) : (
						<DailyJournalSkeleton />
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
