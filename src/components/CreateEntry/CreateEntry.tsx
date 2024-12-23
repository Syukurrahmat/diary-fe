import { Modal, Stack } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { CheckIcon } from 'lucide-react';
import moment from 'moment';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatetimeSection from './DatetimeSection';
import LocationSection from './LocationSection';
import MainSection from './MainSection';
import { useAppContext } from '../../lib/useAppContext';
import { fetcher, myAxios } from '../../lib/fetcher';
import { getUserLocation } from '../../lib/hooks';
import toastStyle from '../../styles/simpleToast.module.css';
import { filetoBase64 } from '../../lib/utils';

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

const formInitialValues: CreateEntryForm = {
	images: [],
	content: '',
	tags: [],
	date: moment().format('YYYY-MM-DD'),
	time: moment().format('HH:mm'),
	datetimeEdited: false,
	coordinateEdited: false,
};

export default function CreateEntryModal({ opened, close }: CreateNoteDrawer) {
	const [section, setSection] = useState<CreateEntryFormSection>('main');
	const [allowInitialMotion, setAllowInitialMotion] = useState(false);
	const [userLocationIsLoading, setUserLocationIsLoading] = useState(false);
	const navigate = useNavigate();
	const { isMobile } = useAppContext();

	const form = useForm<CreateEntryForm>({
		initialValues: formInitialValues,
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
	});

	const onSubmit = form.onSubmit(async (values) => {
		navigate(-1);
		setTimeout(form.reset, 250);
		const toastId = notifications.show({
			message: 'Memposting',
			position: isMobile ? 'bottom-center' : 'top-right',
			autoClose: false,
			withCloseButton : false,
			loading: true,
			color: 'white',
			bg: 'dark',
			translate: 'no',
			mih: '48px',
			classNames: toastStyle,
		});

		const { content, coordinate, date, time, tags, images } = values;
		const submitValue: SubmitValue = {
			content,
			tags,
			location: coordinate && [coordinate.lat, coordinate.lng],
			datetime: moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate(),
			images: await Promise.all(images.map(filetoBase64)),
		};

		myAxios.post('/entries', submitValue).then(() => {
			notifications.update({
				id: toastId,
				message: 'Berhasil di posting',
				icon: <CheckIcon size="20" color="white" />,
				withCloseButton : true,
				loading: false,
				autoClose: 2000,
			});
		});
	});

	const openingHandler = async () => {
		const { datetimeEdited, coordinateEdited } = form.getValues();
		if (!datetimeEdited) {
			const currentTime = moment();
			form.setFieldValue('date', currentTime.format('YYYY-MM-DD'));
			form.setFieldValue('time', currentTime.format('HH:mm'));
		}

		if (!coordinateEdited) {
			setUserLocationIsLoading(true);
			getUserLocation()
				.then(async (e) => {
					if (!e) return;
					form.setFieldValue('coordinate', e);
					const address = await fetcher( `/geocoding/reverse?lat=${e.lat}&lng=${e.lng}`); //prettier-ignore
					form.setFieldValue('address', address.displayName);
				})
				.finally(() => setUserLocationIsLoading(false));
		}
	};

	useEffect(() => {
		if (opened) {
			setTimeout(() => setAllowInitialMotion(true), 250);
			openingHandler();
			window.history.pushState(null, '', window.location.href)
			window.addEventListener('popstate', close);
		} else {
			setAllowInitialMotion(false);
			window.removeEventListener('popstate', close);
		}

		return () => {
			window.removeEventListener('popstate', close);
		};
	}, [opened]);

	const getmotionProps = (key: 'main' | string) => ({
		initial: allowInitialMotion && {
			x: key == 'main' ? '-100%' : '100%',
			opacity: 0,
		},
		exit: { x: key == 'main' ? '-100%' : '100%', opacity: 0 },
		animate: { x: 0, opacity: 1 },
		transition: { duration: 0.3 },
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
			onClose={() => {
				navigate(-1);
			}}
			styles={{
				content: {
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					height: 'auto',
					transition: 'all 250ms',
				},
				body: { padding: 0, flex: '1' },
				header: {
					borderBlockEnd: '1px solid var(--mantine-color-gray-2)',
				},
				title: {
					fontWeight: 600,
				},
				inner: {
					paddingInline: 'var(--mantine-spacing-md)',
				},
			}}
		>
			<Stack component="form" gap="0">
				<AnimatePresence mode="popLayout">
					{section === 'main' && (
						<motion.div {...getmotionProps('main')} key="main">
							<MainSection
								onSubmit={onSubmit}
								form={form}
								onChangeSection={setSection}
								userLocationIsLoading={userLocationIsLoading}
							/>
						</motion.div>
					)}

					{section == 'datepicker' && (
						<motion.div
							{...getmotionProps('datepicker')}
							key="datepicker"
						>
							<DatetimeSection
								form={form}
								onChangeSection={setSection}
							/>
						</motion.div>
					)}
					{section == 'locationpicker' && (
						<motion.div
							{...getmotionProps('locationpicker')}
							key="locationpicker"
						>
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
