import { Modal } from '@mantine/core'; //prettier-ignore
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import moment from 'moment';
import { AnimatePresence, motion } from 'motion/react';
import { DOMAttributes } from 'react';
import { getUserLocation } from '../../lib/hooks';
import { useAppContext } from '../../lib/useAppContext';
import { filetoBase64, getSlideSectionProps } from '../../lib/utils';
import styles from '../../styles/myModal.module.css';
import { LoadingToast } from '../LoadingToast';
import { CreateEntryContext } from './CreateEntryContext';
import DatetimeSection from './DatetimeSection';
import LocationSection from './LocationSection';
import MainSection from './MainSection';

type SubmitValue = {
	content: string;
	datetime: Date;
	location?: number[];
	images: string[];
	tags: string[];
};

export default function CreateEntryProvider({ children }: DOMAttributes<any>) {
	const { isMobile, fetcher } = useAppContext();

	const form = useForm<CreateEntryForm>({
		initialValues: {
			images: [],
			content: '',
			tags: [],
			section: 'main',
			date: moment().format('YYYY-MM-DD'),
			time: moment().format('HH:mm'),
			datetimeEdited: false,
			coordinateEdited: false,
			userLocationIsLoading: false,
		},
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
	});

	const { section, datetimeEdited, coordinateEdited } = form.getValues();

	const [opened, { open, close }] = useDisclosure(false, {
		onOpen: () => {
			window.history.pushState(null, '', window.location.href);
			window.addEventListener('popstate', close);

			if (!datetimeEdited) {
				const currentTime = moment();
				form.setFieldValue('date', currentTime.format('YYYY-MM-DD'));
				form.setFieldValue('time', currentTime.format('HH:mm'));
			}

			if (!coordinateEdited) {
				form.setFieldValue('userLocationIsLoading', true);
				getUserLocation()
					.then(async (e) => {
						if (!e) return;
						form.setFieldValue('coordinate', e);
						const address = await fetcher.get(
							`/geocoding/reverse?lat=${e.lat}&lng=${e.lng}`
						);
						form.setFieldValue('address', address.data.displayName);
					})
					.finally(() =>
						form.setFieldValue('userLocationIsLoading', false)
					);
			}
		},
		onClose: () => {
			window.removeEventListener('popstate', close);
		},
	});

	const onSubmit = form.onSubmit(async (values) => {
		history.back();
		setTimeout(form.reset, 250);

		const loadingToast = LoadingToast('Memosting');

		const { content, coordinate, date, time, tags, images } = values;
		const submitValue: SubmitValue = {
			content,
			tags,
			location: coordinate && [coordinate.lat, coordinate.lng],
			datetime: moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate(),
			images: await Promise.all(images.map(filetoBase64)),
		};

		fetcher
			.post('/entries', submitValue)
			.then(() => loadingToast.success('Berhasil di posting'))
			.catch(() => loadingToast.failed('Gagal di posting'));
	});

	return (
		<CreateEntryContext.Provider value={{ opened, open, close, form }}>
			{children}
			<Modal
				opened={opened}
				title="Buat Catatan"
				size="lg"
				transitionProps={isMobile ? { transition: 'slide-up' } : undefined}
				onClose={() => history.back()}
				classNames={styles}
			>
				<form onSubmit={onSubmit}>
					<AnimatePresence mode="popLayout" initial={false}>
						{section === 'main' && (
							<motion.div {...getSlideSectionProps('main')} key="main">
								<MainSection form={form} />
							</motion.div>
						)}

						{section == 'datepicker' && (
							<motion.div
								{...getSlideSectionProps('datepicker')}
								key="datepicker"
							>
								<DatetimeSection form={form} />
							</motion.div>
						)}
						{section == 'locationpicker' && (
							<motion.div
								{...getSlideSectionProps('locationpicker')}
								key="locationpicker"
							>
								<LocationSection form={form} />
							</motion.div>
						)}
					</AnimatePresence>
				</form>
			</Modal>
		</CreateEntryContext.Provider>
	);
}
