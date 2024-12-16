import { forwardRef } from 'react';
import { MapContainer, MapContainerProps, TileLayer } from 'react-leaflet';

const DisplayMap = forwardRef<any, MapContainerProps>((props, ref) => {
	const {children, ...rest} = props
	return (
		<MapContainer
			ref={ref as any}
			zoomControl={false}
			zoom={16}
			style={{
				width: '100%',
				height: '100%',
			}}
			{...rest}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{children}
		</MapContainer>
	);
});

export default DisplayMap;
