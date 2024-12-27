import { Center, Loader, useMatches } from '@mantine/core'; //prettier-ignore
import { useHeadroom } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AppContext } from './lib/useAppContext';

export default function AppProvider({ children }: { children: ReactNode }) {
	const pinned = useHeadroom({ fixedAt: 120 });
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const isSupportCapture = useMemo(
		() => document.createElement('input').capture !== undefined,
		[]
	);
	const isMobile = useMatches(
		{ base: true, sm: false },
		{ getInitialValueInEffect: false }
	);

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
	return (
		<AppContext.Provider
			value={{
				isMobile,
				isSupportCapture,

				pinned,
			}}
		>
			<Notifications position={isMobile ? 'bottom-center' : 'top-right'} />
			{children}
		</AppContext.Provider>
	);
}
