import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

export const useIsSupportCapture = () => {
	const [isSupported, setIsSupported] = useState(false);

	useEffect(() => {
		const checkCaptureSupport = () => {
			const input = document.createElement('input');
			return input.capture !== undefined;
		};

		setIsSupported(checkCaptureSupport());
	}, []);

	return isSupported;
};

export const useUserLocation = () => {
	const [coord, setCoord] = useState<MyLatLng>()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => {
				const { latitude: lat, longitude: lng } = pos.coords;
				setIsLoading(false)
				setCoord({ lat, lng })
			}, () => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, [])

	return { coord, isLoading }
}


export const useModalDiscloure : typeof useDisclosure = (initialState, callBacks) => {
	const [opened, { open, close, toggle }] = useDisclosure(initialState, {
		onOpen: () => {
			window.history.pushState(null, '', window.location.href);
			window.addEventListener('popstate', close);
			if(callBacks?.onOpen) callBacks.onOpen()
		},
		onClose: () => {
			window.removeEventListener('popstate', close);
			if(callBacks?.onClose) callBacks.onClose()
		},
	});

	return [opened, { open, close, toggle }]
}