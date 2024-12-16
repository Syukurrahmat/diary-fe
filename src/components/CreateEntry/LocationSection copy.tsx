import pinMap from '../../assets/mapMarker-red.svg';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

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
import { useDebouncedCallback } from '@mantine/hooks';
import { ArrowLeft, MapPin, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { autocompleteSearch, reverseCoordinate } from '../../lib/utils';
import { ICreateFormSection } from '../../types/additional';

type AutoCompFetchState = 'idle' | 'loading' | 'notfound';
export default function LocationSection({
	form,
	onChangeSection,
}: ICreateFormSection) {
	const [autoComplete, setAutoComplete] = useState<PlaceItem[]>([]);
	const [autoCompFetchState, setAutoCompFetchState] =
		useState<AutoCompFetchState>('idle');

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [isLoading, setisLoading] = useState(false);
	const [query, setQuery] = useState('');

	const searchingData = useDebouncedCallback((q: string) => {
		setAutoCompFetchState('loading');
		autocompleteSearch(q).then((e) => {
			setAutoComplete(e);
			setAutoCompFetchState(e.length ? 'idle' : 'notfound');
		});
	}, 300);

	const getAddress = useDebouncedCallback((coord: MyLatLng) => {
		setisLoading(true);
		reverseCoordinate(coord)
			.then((e) => form.setFieldValue('coordinateLabel', e.display_name))
			.finally(() => setisLoading(false));
	}, 500);

	const comboboxOnSelect = (val: PlaceItem) => {
		const { name, lat, lon, display_name } = val as PlaceItem;
		setQuery(name);
		searchingData(name);
		form.setFieldValue('coordinate', { lat: +lat, lng: +lon });
		form.setFieldValue('coordinateLabel', display_name);
		combobox.closeDropdown();
	};

	const MapEvent = () => {
		const [isflying, setIsflying] = useState(false);

		const map = useMapEvents({
			moveend: () => {
				if (!isflying) {
					console.log('ss');
					const { lat, lng } = map.getCenter();
					form.setFieldValue('coordinate', { lat, lng });
					getAddress({ lat, lng });
				} else {
					setIsflying(false);
				}
			},
		});
		return null;
	};

	return (
		<Box pos="relative">
			<Box h="330" pos="relative">
				<Box
					className="map-marker-centered"
					style={{ backgroundImage: `url(${pinMap})` }}
				/>
				<MapContainer
					center={form.getValues().coordinate}
					zoomControl={false}
					zoom={16}
					style={{
						width: '100%',
						height: '100%',
					}}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<MapEvent />
				</MapContainer>
			</Box>
			<Box p="md" pos="absolute" w="100%" top={0} style={{ zIndex: 9999 }}>
				<Combobox
					//@ts-expect-error: overide type
					onOptionSubmit={comboboxOnSelect}
					store={combobox}
				>
					<Combobox.Target>
						<TextInput
							flex="1"
							styles={{
								input: { border: 'none', height: '48px' },
							}}
							value={query}
							size="md"
							onChange={(e) => {
								setAutoComplete([]);
								const { value } = e.target;
								setQuery(value);
								if (value.length > 1) {
									searchingData(value);
								}
							}}
							rightSection={
								autoCompFetchState == 'loading' ? (
									<Loader size="xs" color="gray" />
								) : (
									<SearchIcon size="20" />
								)
							}
							leftSection={
								<ActionIcon
									variant="subtle"
									radius="sm"
									onClick={() => onChangeSection('main')}
									children={<ArrowLeft size="20" />}
								/>
							}
							radius="md"
							bd="none"
							placeholder="ssss"
							rightSectionPointerEvents="none"
							onClick={() => combobox.openDropdown()}
							onFocus={() => combobox.openDropdown()}
							onBlur={() => combobox.closeDropdown()}
						/>
					</Combobox.Target>

					{((query.length > 1 && autoComplete.length > 0) ||
						autoCompFetchState == 'notfound') && (
						<Combobox.Dropdown>
							{autoCompFetchState == 'notfound' && (
								<Combobox.Empty>Tidak ditemukan</Combobox.Empty>
							)}

							<Combobox.Options>
								<ScrollArea.Autosize type="scroll" mah={220}>
									{autoComplete.map((item) => (
										<Combobox.Option
											value={item as any}
											key={item.place_id}
										>
											<Text lineClamp={1}>{item.name}</Text>
											<Text size="xs" lineClamp={2} c="dimmed">
												{item.display_name}
											</Text>
										</Combobox.Option>
									))}
								</ScrollArea.Autosize>
							</Combobox.Options>
						</Combobox.Dropdown>
					)}
				</Combobox>
			</Box>
			<Stack bg="white" p="sm" align="end">
				<Group wrap="nowrap" w="100%">
					<ThemeIcon
						variant="light"
						size="lg"
						children={<MapPin size="22" />}
					/>
					<Text size="sm" lineClamp={2}>
						{isLoading && 'Mengambil data...'}
						{!isLoading && form.getValues().coordinateLabel}
					</Text>
				</Group>
				<Button onClick={() => onChangeSection('main')} children="Oke" />
			</Stack>
		</Box>
	);
}
