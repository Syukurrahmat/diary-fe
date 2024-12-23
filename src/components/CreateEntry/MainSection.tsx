import { ActionIcon, Box, Button, CloseButton, Group, Stack } from '@mantine/core'; //prettier-ignore
import { HashIcon, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { CameraButton, GaleryButton } from '../input/ImagePickerButton';
import { Collapse, Text, Textarea } from '@mantine/core';
import { Calendar } from 'lucide-react';
import moment from 'moment';
import { useRef } from 'react';
import { SwiperSlide } from 'swiper/react';
import { useIsSupportCapture } from '../../lib/hooks';
import { ICreateFormSection } from '../../types/additional';
import HashtagInput from '../input/HashtagInput';
import ImagesPreviewItem from '../ImagesPreviewItem';
import MySwiper from '../MySwiper';

export default function MainSection({
	form,
	onChangeSection,
	onSubmit,
	userLocationIsLoading,
}: ICreateFormSection & { onSubmit: any; userLocationIsLoading: boolean }) {
	const isSupportCapture = useIsSupportCapture();
	const [tagsIsOpen, setTagsOpen] = useState(false);
	const tagsRef = useRef<HTMLInputElement>(null);
	const formValues = form.getValues();

	const cansubmit =
		!userLocationIsLoading &&
		(form.getValues().content.length || form.getValues().images.length);

	return (
		<Stack gap="0" h="100%">
			<Box p="md" flex="1">
				<Stack gap="0" mb="6">
					<Button
						mb="4"
						w="fit-content"
						variant="transparent"
						size="compact-sm"
						px="0"
						onClick={() => onChangeSection('datepicker')}
						leftSection={<Calendar size="18" />}
					>
						{moment(
							`${formValues.date} ${formValues.time}`,
							'YYYY-MM-DD HH:mm'
						).format('DD MMM YYYY, HH:mm')}
					</Button>
					<Collapse in={!!formValues.coordinate || userLocationIsLoading}>
						<Group wrap="nowrap">
							<Button
								w="fit-content"
								variant="transparent"
								size="compact-sm"
								c="gray"
								flex="1"
								px="0"
								justify="start"
								maw="100%"
								onClick={() => onChangeSection('locationpicker')}
								leftSection={<MapPinIcon size="18" />}
							>
								<Text
									size="sm"
									c="dimmed"
									style={{
										textOverflow: 'ellipsis',
										overflow: 'hidden',
									}}
									children={
										userLocationIsLoading
											? 'Mengambil Lokasi'
											: formValues.address
											? formValues.address
											: formValues.coordinate
											? `${formValues.coordinate?.lat} , ${formValues.coordinate?.lng}`
											: ''
									}
								/>
							</Button>
							<CloseButton
								size="sm"
								bg="gray.2"
								radius="xl"
								onClick={() => {
									form.setFieldValue('address', '');
									form.setFieldValue('coordinate', undefined);
								}}
							/>
						</Group>
					</Collapse>
				</Stack>

				<Textarea
					placeholder="Apa yang kamu rasakan saat ini??"
					size="md"
					autosize
					variant="unstyled"
					data-autofocus
					minRows={2}
					flex="3"
					key={form.key('content')}
					{...form.getInputProps('content')}
				/>

				{!!formValues.images?.length && (
					<Box pt="xs">
						<MySwiper>
							{formValues.images.map((file, index) => (
								<SwiperSlide
									key={file.name}
									style={{
										width: '150px',
										height: '150px',
									}}
								>
									<ImagesPreviewItem
										file={file}
										onDelete={() =>
											form.removeListItem('images', index)
										}
									/>
								</SwiperSlide>
							))}
						</MySwiper>
					</Box>
				)}

				<Collapse
					in={tagsIsOpen || formValues.tags.length > 0}
					pos="relative"
					pt="xs"
					transitionDuration={200}
				>
					<HashtagInput
						ref={tagsRef}
						autoFocus
						acceptValueOnBlur
						defaultValue={form.values.tags}
						onChange={(e) => form.setFieldValue('tags', e)}
						onBlur={() => {
							if (!formValues.tags.length) setTagsOpen(false);
						}}
					/>
				</Collapse>
			</Box>
			<Box
				pos="sticky"
				bottom={0}
				className="borderedModalFooter"
				bg="white"
				p="sm"
			>
				<Group wrap="nowrap" flex="1">
					<Group wrap="nowrap" flex="1">
						{isSupportCapture && (
							<CameraButton
								onAddFile={(e) => form.insertListItem('images', e)}
							/>
						)}
						<GaleryButton
							onAddFiles={(e) =>
								e.forEach((f) => form.insertListItem('images', f))
							}
						/>
						<ActionIcon
							variant="transparent"
							size="sm"
							c="gray"
							children={<MapPinIcon />}
							onClick={() => onChangeSection('locationpicker')}
						/>
						<ActionIcon
							variant="transparent"
							size="sm"
							c="gray"
							onClick={() => {
								if (formValues.tags.length == 0) {
									setTagsOpen(true);
									setTimeout(() => tagsRef.current?.focus());
								} else {
									tagsRef.current?.focus();
								}
							}}
							children={<HashIcon />}
						/>
					</Group>

					<Button
						disabled={!cansubmit}
						onClick={onSubmit}
						children="Buat"
					/>
				</Group>
			</Box>
		</Stack>
	);
}
