import { Box, Image as Img } from '@mantine/core';

import { SwiperSlide } from 'swiper/react';
import MySwiper from '../MySwiper';
import style from './entry.module.css';

interface ImageWrapper {
	images: EntryImageData[];
}

export default function EntryImagesSlider({ images }: ImageWrapper) {
	if (images.length == 0) return null;

	const isSingle = images.length == 1;

	const isAllPortrait = images.every(({ width, height }) => height > width);
	const isAllLanscape = images.every(({ width, height }) => height <= width);

	const height =
		(isAllPortrait ? 250 : isAllLanscape ? 200 : 225) +
		(isSingle ? 100 : 0) +
		'px';

	const getSlideItemStyle = (i: number) => ({
		aspectRatio: isSingle ? images[i].width / images[i].height : undefined,
		height: height,
	});

	return (
		<Box h={height}>
			<Box pos="absolute" left={0} w="100%">
				<MySwiper spaceBetween={8}>
					{images.map((e, i) => (
						<SwiperSlide
							key={i}
							style={getSlideItemStyle(i)}
							className={style.imageItem}
						>
							<Img
								fit="cover"
								radius="md"
								w="100%"
								loading='lazy'
								h="100%"
								bd="1px solid gray.4"
								src={e.imageUrl}
								bg="white"
							/>
						</SwiperSlide>
					))}
				</MySwiper>
			</Box>
		</Box>
	);
}
