import { ActionIcon, Affix, Avatar, Center, Container, Group, Loader, Paper, rem, Stack, Transition } from '@mantine/core'; //prettier-ignore
import { PlusIcon } from 'lucide-react';
import useSWR from 'swr';
import {
	CameraButton,
	GaleryButton,
} from '../components/input/ImagePickerButton';
import DaylyJournal from '../components/JournalList/DayilyJournal';
import { useAppContext } from '../lib/useAppContext';

export default function Home() {
	const { isSupportCapture, isMobile, createEntryControl, pinned, createEntryOpened } = useAppContext(); //prettier-ignore
	const { data } = useSWR<JournalList[]>('/journals');

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
						style={{ userSelect: 'none', justifyContent: 'start' }}
						children="Buat Catatan"
						onClick={createEntryControl.open}
					/>
					{isSupportCapture ? (
						<CameraButton onAddFile={() => {}} />
					) : (
						<GaleryButton onAddFiles={() => {}} />
					)}
				</Paper>

				<Stack gap="md">
					{data ? (
						data.map((journal) => (
							<DaylyJournal data={journal} key={journal.date} />
						))
					) : (
						<Center>
							<Loader type="dots" />
						</Center>
					)}
				</Stack>
			</Stack>
			{isMobile && (
				<Affix
					style={{
						zIndex: 100,
						bottom: 'var(--mantine-spacing-xl)',
						right: 'var(--mantine-spacing-md)',
					}}
				>
					<Transition
						duration={300}
						transition="slide-up"
						mounted={!pinned && !createEntryOpened}
					>
						{(transitionStyles) => (
							<ActionIcon
								size="input-lg"
								variant="default"
								c="blue.5"
								style={transitionStyles}
								children={<PlusIcon size="30" />}
								onClick={createEntryControl.open}
							/>
						)}
					</Transition>
				</Affix>
			)}
		</Container>
	);
}
