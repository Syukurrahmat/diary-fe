import { FreeMode, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperProps } from 'swiper/react';

export default function MySwiperSlider(props: SwiperProps) {
	return (
		<Swiper
			slidesPerView="auto"
			spaceBetween={8}
			grabCursor
			modules={[FreeMode, Mousewheel]}
			freeMode={{
				enabled: true,
				momentum: true,
				momentumRatio: 0.5,
				minimumVelocity: 0.01,
			}}
			mousewheel
			style={{
				userSelect: 'none',
			}}
			{...props}
		/>
	);
}
