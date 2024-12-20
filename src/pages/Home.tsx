import { Avatar, Container, Group, Input, Paper, Stack, Title } from '@mantine/core'; //prettier-ignore
import { CameraButton, GaleryButton } from '../components/ImagePickerButton';
import DailyContainer from '../components/JournalList/JournalList';
import { useIsSupportCapture } from '../lib/hooks';

export default function Home() {
	const supportCapture = useIsSupportCapture();

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
				{supportCapture ? (
					<CameraButton
						variant="transparent"
						color="gray"
						onAddFile={() => {}}
					/>
				) : (
					<GaleryButton
						variant="transparent"
						color="gray"
						onAddFiles={() => {}}
					/>
				)}
			</Paper>
			<DailyContainer />
		</Container>
	);
}
