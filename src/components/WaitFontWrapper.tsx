import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';

export default function WaitFontWrapper({ children }: any) {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		document.fonts.ready.then(() => setFontsLoaded(true));
	}, []);

	if (!fontsLoaded) return <LoadingScreen />;

	return children;
}
