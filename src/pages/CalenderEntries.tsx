import {
	ActionIcon,
	Button,
	ButtonGroup,
	Center,
	Container,
	Group,
	Loader,
	Paper,
	rem,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import {
	ChevronLeft,
	ChevronRight,
	DownloadIcon,
	PlusIcon,
	Share2Icon,
	SortAscIcon,
	SortDescIcon,
} from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { Entry, EntryWrapper } from '../components/Entry/Entry';
import TrackerCard from '../components/JournalList/TrackerCard';
import { useCreateEntryModal } from '../components/CreateEntry/CreateEntryContext';

export default function CalenderDate() {
	const param = useParams().date;
	const date = useMemo(() => moment(param), [param]);
	const dateIsValid = date.isValid();
	const { form, open } = useCreateEntryModal();
	const { data } = useSWR<JournalItem | null>(
		dateIsValid && '/journals/' + date.format('YYYY-MM-DD')
	);

	const navigate = useNavigate();
	const [isReversed, setIsReversed] = useState(false);

	const displayEntries = data
		? isReversed
			? data.entries.slice().reverse()
			: data.entries
		: [];

	if (!dateIsValid) return <Navigate to="/" />;

	return (
		<Container size="sm" py="xs">
			<Group wrap="nowrap" mb="sm" align="start" justify="space-between">
				<Group gap="0" component="h3" my="0">
					<Title component="span" size="h3">
						{date.format('dddd, DD [ ]')}
					</Title>
					<Title component="span" size="h3">
						&nbsp;{date.format('MMMM YYYY')}
					</Title>
				</Group>
				<Group wrap="nowrap" gap="sm">
					<ActionIcon
						variant="default"
						size="lg"
						onClick={() =>
							navigate(
								`/calendar/${date
									.clone()
									.add(-1, 'd')
									.format('YYYY-MM-DD')}`
							)
						}
						children={<ChevronLeft />}
					/>
					<ActionIcon
						disabled={moment()
							.startOf('d')
							.isSameOrBefore(date.clone().startOf('d'))}
						variant="default"
						size="lg"
						onClick={() =>
							navigate(
								`/calendar/${date
									.clone()
									.add(1, 'd')
									.format('YYYY-MM-DD')}`
							)
						}
						children={<ChevronRight />}
					/>
				</Group>
			</Group>
			{data !== undefined ? (
				data !== null ? (
					<Stack gap="sm">
						<TrackerCard radius="md" data={data} />
						<ButtonGroup
							style={{
								borderRadius: 'var(--mantine-radius-md)',
								border: '1px solid var(--mantine-color-gray-3)',
							}}
							variant="default"
							w="100%"
						>
							<Button
								size="sm"
								variant="subtle"
								h={rem(44)}
								flex="1"
								leftSection={<PlusIcon />}
							>
								Buat Catatan Baru
							</Button>
							<Button
								size="sm"
								variant="subtle"
								h={rem(44)}
								flex="1"
								leftSection={<Share2Icon size="18" />}
							>
								Bagikan
							</Button>
							<Button
								size="sm"
								variant="subtle"
								h={rem(44)}
								flex="1"
								leftSection={<DownloadIcon size="18" />}
							>
								Donwload
							</Button>
						</ButtonGroup>
						<Paper withBorder className="daylyJournalPapper">
							<Group
								justify="space-between"
								p="md"
								className="borderedModalHeader"
							>
								<Title size="lg">Linimasa</Title>
								<ActionIcon
									size="sm"
									variant="transparent"
									color="gray"
									onClick={() => {
										setIsReversed((e) => !e);
									}}
									children={
										isReversed ? <SortDescIcon /> : <SortAscIcon />
									}
								/>
							</Group>
							<EntryWrapper py="sm">
								{displayEntries.map((e) => (
									<Entry data={e} key={e.id} />
								))}
							</EntryWrapper>
						</Paper>
					</Stack>
				) : (
					<Stack align="center">
						<Text>Kosong</Text>
						<Button
							leftSection={<PlusIcon />}
							onClick={() => {
								form.setFieldValue('date', date.format('YYYY-MM-DD'));
								form.setFieldValue('datetimeEdited', date.format('YYYY-MM-DD'));
								open()
 							}}
						>
							Buat Catatan pada Hari ini
						</Button>
					</Stack>
				)
			) : (
				<Center p="md">
					<Loader type="dots" />
				</Center>
			)}
		</Container>
	);
}
