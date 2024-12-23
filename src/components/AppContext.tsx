import { Center, Loader, useMatches } from '@mantine/core'; //prettier-ignore
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';

import { ReactNode } from 'react';
import { AppContext } from '../lib/useAppContext';

export default function AppProvider({ children }: { children: ReactNode }) {
	const pinned = useHeadroom({ fixedAt: 120 });
	const [createEntryOpened, { open, close }] = useDisclosure(false); //prettier-ignore
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
				createEntryOpened,
				createEntryControl: { open, close },
				pinned,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
