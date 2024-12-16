import pinMap from '../../assets/mapMarker-red.svg';

import 'leaflet/dist/leaflet.css';
import { useMapEvents } from 'react-leaflet';

import {
	ActionIcon,
	Box,
	Button,
	Combobox,
	Group,
	Loader,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	useCombobox,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Map } from 'leaflet';
import { ArrowLeft, MapPin, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getReverseCoordinateUrl } from '../../lib/utils';
import { ICreateFormSection } from '../../types/additional';
import DisplayMap from '../DisplayMap';

const FALLBACK_COORD = { lat: -7.556258, lng: 110.821336 };

export default function LocationSection({
	form,
	onChangeSection,
}: ICreateFormSection) {
	const [mapRef, setMapRef] = useState<Map>();
	const [isGraping, setIsGraping] = useState(false);
	const [currentCoord, setCurrentCoord] = useState(
		form.getValues().coordinate || FALLBACK_COORD
	);

	const { data: currentAddress } = useSWR<PlaceItem>(
		`/geocoding/reverse?lat=${currentCoord.lat}&lng=${currentCoord.lng}`
	);

	const MapEvent = () => {
		const map = useMapEvents({
			movestart: () => setIsGraping(true),
			moveend: () => {
				setIsGraping(false);
				const { lat, lng } = map.getCenter();
				setCurrentCoord({ lat, lng });
			},
		});
		return null;
	};

	useEffect(() => {
		form.setFieldValue('coordinate', currentCoord);
		form.setFieldValue('coordinateLabel', currentAddress?.displayName || '');
	}, [currentAddress, currentCoord, form]);

	return (
		<Box pos="relative">
			<Box h="330" pos="relative">
				<Box
					className="map-marker-centered"
					style={{ backgroundImage: `url(${pinMap})` }}
				/>
				<DisplayMap ref={setMapRef} center={currentCoord}>
					<MapEvent />
				</DisplayMap>
			</Box>
			<Box p="md" pos="absolute" w="100%" top={0} style={{ zIndex: 9999 }}>
				{mapRef && (
					<MapSearchAutoComplete
						map={mapRef}
						onBackButtonClick={() => onChangeSection('main')}
					/>
				)}
			</Box>
			<Stack bg="white" p="sm" align="end">
				<Group gap="sm" wrap="nowrap" w="100%">
					<ThemeIcon
						variant="light"
						size="lg"
						children={<MapPin size="22" />}
					/>
					<Text size="sm" lineClamp={2}>
						{isGraping
							? 'Lepaskan penanda untuk mendapatkan alamat'
							: currentAddress?.displayName || 'Mengambil data...'}
					</Text>
				</Group>
				<Button onClick={() => onChangeSection('main')} children="Oke" />
			</Stack>
		</Box>
	);
}

interface MapSearchAutoComplete {
	map: Map;
	onBackButtonClick: () => void;
}

function MapSearchAutoComplete({
	map,
	onBackButtonClick,
}: MapSearchAutoComplete) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState('');
	const [debouncedQuery] = useDebouncedValue(query, 300);

	const {
		data,
		isLoading,
		mutate: mutateQuery,
	} = useSWR<PlaceItem[]>(`/geocoding/search?q=${debouncedQuery}`);

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const comboboxOnSelect = (val: PlaceItem) => {
		const { name, lat, lng } = val;
		const coord = { lat: +lat, lng: +lng };

		setQuery(name);
		mutate(getReverseCoordinateUrl(coord), val, {
			revalidate: false,
		});
		combobox.closeDropdown();
		inputRef.current?.blur();
		map.flyTo(coord, undefined, { duration: 3 });
	};

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		mutateQuery(undefined, { revalidate: false });
	};

	return (
		<Combobox
			//@ts-expect-error: overide type
			onOptionSubmit={comboboxOnSelect}
			store={combobox}
		>
			<Combobox.Target>
				<TextInput
					ref={inputRef}
					flex="1"
					size="md"
					radius="md"
					bd="none"
					placeholder="Cari Tempat ...."
					rightSectionPointerEvents="none"
					value={query}
					onChange={inputOnChange}
					leftSection={
						<ActionIcon
							variant="subtle"
							radius="sm"
							onClick={() => onBackButtonClick()}
							children={<ArrowLeft size="20" />}
						/>
					}
					rightSection={
						!isLoading ? (
							<SearchIcon size="20" />
						) : (
							<Loader size="xs" color="gray" />
						)
					}
					styles={{ input: { border: 'none', height: '48px' } }}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => combobox.closeDropdown()}
				/>
			</Combobox.Target>

			{data && (
				<Combobox.Dropdown>
					{data.length == 0 && (
						<Combobox.Empty>Tidak ditemukan</Combobox.Empty>
					)}

					<Combobox.Options>
						<ScrollArea.Autosize type="scroll" mah={220}>
							{data?.map((item) => (
								<Combobox.Option value={item as any} key={item.placeId}>
									<Text lineClamp={1}>{item.name}</Text>
									<Text size="xs" lineClamp={2} c="dimmed">
										{item.displayName}
									</Text>
								</Combobox.Option>
							))}
						</ScrollArea.Autosize>
					</Combobox.Options>
				</Combobox.Dropdown>
			)}
		</Combobox>
	);
}