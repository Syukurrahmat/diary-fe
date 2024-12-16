import { Image as Img } from '@mantine/core';
import { useEffect, useState } from 'react';

import { SwiperSlide } from 'swiper/react';
import MySwiperSlider from '../components/MySlider';

const ggg = [
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB6em8bBiDFn_p0jcA1n1zoPk1hocoXxCG_w&s',
	'https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg',
	'https://media.istockphoto.com/id/184395916/photo/peace-sign.jpg?s=612x612&w=0&k=20&c=xGdRDTUcKGMzYWFwRGWewfWdHgRvndA5dN0ye6TA5ac=',
	'https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg',
];

export default function ImageWrapper({
	imageUrls = ggg,
}: {
	imageUrls?: string[];
}) {
	const [height, setHeight] = useState(0);

	useEffect(() => {
		findTallestImage(imageUrls).then((h) => {
			setHeight(h > 300 ? 300 : h);
		});
	}, [imageUrls]);

	if (!height) return null;

	const getSlideItemStyle = (index: number) => ({
		marginInlineStart:
			index == 0 ? 'calc(2 * var(--mantine-spacing-md))' : undefined,
		marginInlineEnd:
			index == imageUrls.length - 1
				? 'calc(var(--mantine-spacing-md))'
				: undefined,
		width: 'fit-content',
		height: '300px',
	});

	return (
		<MySwiperSlider spaceBetween={8}>
			{imageUrls.map((e, i) => (
				<SwiperSlide key={i} style={getSlideItemStyle(i)}>
					<Img
						fit="cover"
						radius="md"
						maw="100%"
						h="100%"
						bd="1px solid gray.4"
						src={e}
					/>
				</SwiperSlide>
			))}
		</MySwiperSlider>
	);
}

async function findTallestImage(imageUrls: string[]) {
	if (!imageUrls.length) return 0;

	let maxHeight = 0;

	await Promise.all(
		imageUrls.map((url) => {
			return new Promise((resolve) => {
				const img = new Image();
				img.src = url; // Set URL gambar

				img.onload = function () {
					// Jika tinggi gambar lebih besar dari maxHeight, perbarui
					if (img.height > maxHeight) {
						maxHeight = img.height;
					}
					resolve(null);
				};
				img.onerror = function () {
					resolve(null); // Tetap resolve meskipun terjadi kesalahan
				};
			});
		})
	);
	return maxHeight;
}
