import { ActionIcon, Button, ButtonGroup, Center, Container, Group, Loader, Paper, rem, Stack, Title } from '@mantine/core'; //prettier-ignore
import { ChevronLeft, ChevronRight, DownloadIcon, PlusIcon, Share2Icon, SortAscIcon, SortDescIcon } from 'lucide-react'; //prettier-ignore
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { Entry, EntryWrapper } from '../components/Entry/Entry';
import SummaryCard from '../components/SummaryCard/SummaryCard';

export default function CalenderDateDetail() {
	const param = useParams().date;
	const date = useMemo(() => moment(param), [param]);
	const dateIsValid = date.isValid();
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
						{date.format('dddd, DD')} &nbsp;
					</Title>
					<Title component="span" size="h3">
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
				<Stack gap="sm">
					<SummaryCard
						date={moment(date).format('YYYY-MM-DD')}
						habits={data?.habits || []}
						summary={data?.summary}
						radius="md"
					/>
					<ButtonGroup
						bg="white"
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
	);
}
