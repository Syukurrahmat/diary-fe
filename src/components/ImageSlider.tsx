import { Box, Image as Img } from '@mantine/core';

import { ReactNode } from 'react';
import { SwiperSlide } from 'swiper/react';
import MySwiperSlider from '../components/MySlider';

interface ImageWrapper {
	images: EntryImageData[];
	fluid?: boolean;
}

export default function ImageSlider({ images, fluid }: ImageWrapper) {
	if (images.length == 0) return null;
	const isSingle = images.length == 1;

	const isAllPortrait = images.every(({ width, height }) => height > width);
	const isAllLanscape = images.every(({ width, height }) => height <= width);

	const height =
		(isAllPortrait ? 250 : isAllLanscape ? 200 : 225) +
		(isSingle ? 100 : 0) +
		'px';

	const getSlideItemStyle = (i: number) => ({
		marginInlineStart: i == 0 ? 'calc(var(--mantine-spacing-md) + var(--mantine-spacing-lg))' : undefined, //prettier-ignore
		marginInlineEnd: i == images.length - 1 ? 'calc(var(--mantine-spacing-md))' : undefined, //prettier-ignore
		width: 'fit-content',
		minWidth: '200px',
		maxWidth: 'calc(100% - 3 * var(--mantine-spacing-md))',
		aspectRatio: isSingle ? images[i].width / images[i].height : undefined,
		height: height,
	});

	return (
		<Box component={fluid ? Jsjsjs : undefined} fluidHeight={height}>
			<MySwiperSlider spaceBetween={8}>
				{images.map((e, i) => (
					<SwiperSlide key={i} style={getSlideItemStyle(i)}>
						<Img
							fit="cover"
							radius="md"
							w="100%"
							h="100%"
							bd="1px solid gray.4"
							src={e.imageUrl}
							style={{}}
							bg='white'
						/>
					</SwiperSlide>
				))}
			</MySwiperSlider>
		</Box>
	);
}

function Jsjsjs({
	children,
	fluidHeight,
}: {
	children: ReactNode;
	fluidHeight?: string;
}) {
	return (
		<Box h={fluidHeight}>
			<Box
				pos="absolute"
				w="calc(100% + var(--mantine-spacing-md) + var(--mantine-spacing-lg))"
				h="fluidHeight"
				left="calc(-1*var(--mantine-spacing-lg))"
				style={{
					zIndex: 10,
				}}
				children={children}
			/>
		</Box>
	);
}
