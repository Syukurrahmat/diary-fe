import { Modal, Stack } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import moment from 'moment';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import DatetimeSection from '../components/CreateEntry/DatetimeSection';
import LocationSection from '../components/CreateEntry/LocationSection';
import MainSection from '../components/CreateEntry/MainSection';
import { getUserLocation } from '../lib/hooks';
import { reverseCoordinate, filetoBase64 } from '../lib/utils';
import { myAxios } from '../lib/fetcher';

interface CreateNoteDrawer {
	opened: boolean;
	close: () => void;
}

type SubmitValue = {
	content: string;
	datetime: Date;
	location?: number[];
	images: string[];
	tags: string[];
};

export default function CreateNoteModal({ opened, close }: CreateNoteDrawer) {
	const [section, setSection] = useState<CreateEntryFormSection>('main');
	const [allowInitialMotion, setAllowInitialMotion] = useState(false);

	const initialValues = {
		images: [],
		content: '',
		tags: [],
		date: moment().format('YYYY-MM-DD'),
		time: moment().format('HH:mm'),
	};

	const form = useForm<CreateEntryForm>({
		initialValues,
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
	});

	const onSubmit = form.onSubmit(async (values) => {
		const { content, coordinate, date, time, tags, images } = values;

		const submitValue: SubmitValue = {
			content,
			location: coordinate && [coordinate.lat, coordinate.lng],
			tags,
			datetime: moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm:').toDate(),
			images: await Promise.all(images.map(filetoBase64)),
		};

		myAxios.post('/entries', submitValue).then((e) => {
			console.log(e.data);
		});
	});

	useEffect(() => {
		getUserLocation().then(async (e) => {
			if (!e) return;
			const address = await reverseCoordinate(e);
			form.setFieldValue('coordinate', e);
			form.setFieldValue('coordinateLabel', address.display_name);
		});
	}, []);

	useEffect(() => {
		if (opened) setTimeout(() => setAllowInitialMotion(true), 250);
		else setAllowInitialMotion(false);
	}, [opened]);

	const getmotionProps = (key: 'main' | string) => ({
		initial: allowInitialMotion && {
			x: key == 'main' ? '-100%' : '100%',
			opacity: 0,
		},
		exit: { x: key == 'main' ? '-100%' : '100%', opacity: 0 },
		animate: { x: 0, opacity: 1 },
		transition: { duration: 0.3 },
		key: key,
	});

	return (
		<Modal
			title="Buat Catatan"
			opened={opened}
			size="lg"
			transitionProps={{
				duration: 250,
				transition: 'slide-up',
			}}
			onClose={close}
			styles={{
				content: {
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
				},
				body: { padding: 0, flex: '1' },
				header: {
					borderBlockEnd: '1px solid var(--mantine-color-gray-2)',
				},
			}}
		>
			<Stack component="form" gap="0" h="100%">
				<AnimatePresence mode="popLayout">
					{section === 'main' && (
						<motion.div {...getmotionProps('main')}>
							<MainSection
								onSubmit={onSubmit}
								form={form}
								onChangeSection={setSection}
							/>
						</motion.div>
					)}

					{section == 'datepicker' && (
						<motion.div {...getmotionProps('datepicker')}>
							<DatetimeSection
								form={form}
								onChangeSection={setSection}
							/>
						</motion.div>
					)}
					{section == 'locationpicker' && (
						<motion.div {...getmotionProps('locationpicker')}>
							<LocationSection
								form={form}
								onChangeSection={setSection}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</Stack>
		</Modal>
	);
}
