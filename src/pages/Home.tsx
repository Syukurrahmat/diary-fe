import { ActionIcon, Avatar, Badge, Box, Container, Group, Input, Paper, Stack, Text, Timeline, Title, useMantineTheme } from '@mantine/core'; //prettier-ignore
import { CameraIcon, DownloadIcon, Share2Icon } from 'lucide-react';
import ImageWrapper from '../components/ImageSlider';

export default function Home() {
	return (
		<Container component={Stack} py="md" size="sm">
			<Title size="h3" component="h1">
				Journal
			</Title>
			<Paper
				component={Group}
				wrap="nowrap"
				withBorder
				px="md"
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

				<Input
					flex="1"
					px="0"
					color="gray"
					fw="normal"
					placeholder="Buat Catatan"
					variant="unstyled"
				/>
				<ActionIcon
					variant="transparent"
					color="gray"
					children={<CameraIcon />}
				/>
			</Paper>
			<DailyContainer />
			<Input />
		</Container>
	);
}

const tags = ['kucing', 'Seru', 'love'];

function DailyContainer() {
	const theme = useMantineTheme();
	return (
		<Stack gap="xs">
			<Paper withBorder>
				<Group
					justify="space-between"
					p="md"
					style={{
						borderBlockEnd: '1px solid ' + theme.colors.gray[2],
					}}
				>
					<Title size="h4">Hari ini</Title>
					<Group gap="xs">
						<ActionIcon
							size="sm"
							variant="transparent"
							color="gray"
							children={<DownloadIcon />}
						/>
						<ActionIcon
							size="sm"
							variant="transparent"
							color="gray"
							children={<Share2Icon />}
						/>
					</Group>
				</Group>
				<Box pos="relative">
					<Timeline active={99999} bulletSize={14} p="md" lineWidth={2}>
						<Timeline.Item title="Baru Saja">
							<Text c="dimmed" size="sm" lineClamp={1}>
								Grha Sabha Pramana UGM, Jalan Persatuan, Catur Tunggal,
								Depok, Sleman, Daerah Istimewa Yogyakarta, Jawa, 55281,
								Indonesia
							</Text>
							<Stack py="4" mt="4" gap="sm">
								<Box h="300px">
									<Box
										pos="absolute"
										w="calc(100% + 2*var(--mantine-spacing-md))"
										h="300px"
										left="calc(-1*var(--mantine-spacing-md))"
										style={{
											zIndex: 10,
										}}
									>
										<ImageWrapper />
									</Box>
								</Box>
								<Text>
									Lorem ipsum dolor, sit amet consectetur adipisicing
									elit. At delectus impedit hic inventore, quos rerum
									porro architecto fugiat quasi beatae soluta magni
									nesciunt iure necessitatibus, labore, doloremque
									deserunt? Recusandae, cum!
								</Text>
								<Stack gap="xs">
									{!!tags.length && (
										<Group gap="xs">
											{tags.map((e) => (
												<Badge
													key={e}
													radius="sm"
													size='md'
													fz='sm'
													fw='600'
													variant="light"
													tt="capitalize"
													children={e}
												/>
											))}
										</Group>
									)}
								</Stack>
							</Stack>
						</Timeline.Item>

						<Timeline.Item title="14:34">
							<Text c="dimmed" size="sm">
								You&apos;ve pushed 23 commits to
								<Text variant="link" component="span" inherit>
									fix-notifications branch
								</Text>
							</Text>
						</Timeline.Item>

						<Timeline.Item title="20:33">
							<Text c="dimmed" size="sm">
								You&apos;ve submitted a pull request
								<Text variant="link" component="span" inherit>
									Fix incorrect notification message (#187)
								</Text>
							</Text>
						</Timeline.Item>

						<Timeline.Item title="Code review">
							<Text c="dimmed" size="sm">
								<Text variant="link" component="span" inherit>
									Robert Gluesticker
								</Text>{' '}
								left a code review on your pull request
							</Text>
						</Timeline.Item>
					</Timeline>
				</Box>
			</Paper>
		</Stack>
	);
}
