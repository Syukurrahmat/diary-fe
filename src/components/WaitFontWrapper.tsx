import { Center } from '@mantine/core';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WaitFontWrapper({ children }: any) {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		document.fonts.ready.then(() => setFontsLoaded(true));
	}, []);

	if (!fontsLoaded) {
		return (
			<Center bg="#f8f9fa" h="100vh">
				<Loader size="sm" color="gray" stroke="30" />
			</Center>
		);
	}

	return children;
}
