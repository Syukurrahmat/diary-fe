import { ActionIcon, Box, Button, Group, Space, Stack } from '@mantine/core'; //prettier-ignore
import { HashIcon, MapPinIcon } from 'lucide-react'; //prettier-ignore
import { useState } from 'react';
import { CameraButton, GaleryButton } from '../ImagePickerButton';

import { Collapse, Text, Textarea } from '@mantine/core'; //prettier-ignore
import { Calendar } from 'lucide-react'; //prettier-ignore
import { useRef } from 'react';
import { SwiperSlide } from 'swiper/react';
import { ICreateFormSection } from '../../types/additional';
import HashtagInput from '../HashtagInput';
import ImagesPreviewItem from '../ImagesPreviewItem';
import MySwiperSlider from '../MySlider';
import { useIsSupportCapture } from '../../lib/hooks';
import moment from 'moment';

export default function MainSection({
	form,
	onChangeSection,
	onSubmit,
}: ICreateFormSection & { onSubmit: any }) {
	const isSupportCapture = useIsSupportCapture();
	const [tagsIsOpen, setTagsOpen] = useState(false);
	const tagsRef = useRef<HTMLInputElement>(null);
	const formValues = form.getValues();

	return (
		<Stack gap="0" h="100%">
			<Box p="md" flex="1">
				<Stack gap="0" mb="xs">
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
					<Collapse
						in={Boolean(
							formValues.coordinate && formValues.coordinateLabel
						)}
					>
						<Button
							w="fit-content"
							variant="transparent"
							size="compact-sm"
							c="gray"
							px="0"
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
								children={formValues.coordinateLabel}
							/>
						</Button>
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
						<MySwiperSlider>
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
						</MySwiperSlider>
					</Box>
				)}

				<Collapse
					in={tagsIsOpen}
					pos="relative"
					pt="xs"
					transitionDuration={200}
				>
					<HashtagInput
						ref={tagsRef}
						autoFocus
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
				<Group justify="space-between" flex="1" gap="lg">
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
							if (!formValues.tags.length) {
								setTagsOpen(true);
								setTimeout(() => {
									tagsRef.current?.focus();
								});
							} else {
								tagsRef.current?.focus();
							}
						}}
						children={<HashIcon />}
					/>

					<Space flex="1" />
					<Button onClick={onSubmit}>Buat</Button>
				</Group>
			</Box>
		</Stack>
	);
}
