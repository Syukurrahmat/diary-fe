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


export const getUserLocation = () => {
	return new Promise<MyLatLng | null>((res) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => {
				const { latitude: lat, longitude: lng } = pos.coords;
				res({ lat, lng })
			}, () => res(null));
		} else {
			res(null);
		}
	})
}

export const useModalBackButtonHandler = (opened: boolean, aditionalCbOnOpen?: () => any) => {
	useEffect(() => {
		if (opened) {
			if (aditionalCbOnOpen) aditionalCbOnOpen()
			window.history.pushState(null, '', window.location.href);
			window.addEventListener('popstate', close);
		} else {
			window.removeEventListener('popstate', close);
		}

		return () => {
			window.removeEventListener('popstate', close);
		};
	}, [opened]);
}