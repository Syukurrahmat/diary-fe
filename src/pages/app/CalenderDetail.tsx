import { ActionIcon, Box, Button, ButtonGroup, Center, Container, Group, Loader, Paper, rem, Stack, Title } from '@mantine/core'; //prettier-ignore
import { ChevronLeft, ChevronRight, DownloadIcon, PlusIcon, Share2Icon, SortAscIcon, SortDescIcon } from 'lucide-react'; //prettier-ignore
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useCreateEntryModal } from '../../components/Modal/CreateEntry/CreateEntryContext';
import { Entry, EntryWrapper } from '../../components/Entry/Entry';
import SummaryCard from '../../components/SummaryCard/SummaryCard';

export default function CalenderDateDetail() {
	const navigate = useNavigate();
	const createEntry = useCreateEntryModal();

	const dateParam = useParams().date;

	const [isReversed, setIsReversed] = useState(false);
	const date = useMemo(() => moment(dateParam), [dateParam]);

	const dateIsValid = date.isValid();
	const { data } = useSWR<JournalItem | null>(
		dateIsValid && '/journals/' + date.format('YYYY-MM-DD')
	);

	if (!dateIsValid) return <Navigate to="/" />;

	const onCreateEntryCliked = () => {
		createEntry.form.setFieldValue('date', date.format('YYYY-MM-DD'));
		createEntry.open();
	};

	const displayEntries = data
		? isReversed
			? data.entries.slice().reverse()
			: data.entries
		: [];

	return (
		<Box>
			<Container size="sm" py="xs">
				<Group wrap="nowrap" mb="sm" align="start" justify="space-between">
					<Group gap="0" component="h3" my="0">
						<Title component="span" size="h3" fw="500">
							{date.format('dddd, DD')} &nbsp;
						</Title>
						<Title component="span" size="h3" fw="500">
							{date.format('MMMM YYYY')}
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
							children={<ChevronLeft size="20" />}
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
							children={<ChevronRight size="20" />}
						/>
					</Group>
				</Group>
			</Container>
			<Container size="sm" py='0' px={{ base: '0px', xs: 'sm' }}>
				{data !== undefined ? (
					<Stack gap="sm">
						<SummaryCard
							className="fluid-Paper"
							inJournal={false}
							date={moment(date).format('YYYY-MM-DD')}
							habits={data?.habits || []}
							summary={data?.summary}
							radius="md"
						/>
						
						<ButtonGroup
							bg="white"
							styles={{
								group: {
									borderRadius: 'var(--mantine-radius-md)',
									border: '1px solid var(--mantine-color-gray-3)',
								},
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
								onClick={onCreateEntryCliked}
								children="Buat Catatan Baru"
							/>
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
						<Paper withBorder className="fluid-Paper">
							<Group
								justify="space-between"
								p="md"
								className="borderBottom"
							>
								<Title size="lg" fw="600">
									Linimasa
								</Title>
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
							{displayEntries.length ? (
								<EntryWrapper py="sm">
									{displayEntries.map((e) => (
										<Entry data={e} key={e.id} />
									))}
								</EntryWrapper>
							) : (
								<Center py="sm" c="dimmed">
									Tidak Ada Catatan
								</Center>
							)}
						</Paper>
					</Stack>
				) : (
					<Center p="md">
						<Loader type="dots" />
					</Center>
				)}
			</Container>
		</Box>
	);
}
