import { useMatches } from '@mantine/core'; //prettier-ignore
import { Notifications } from '@mantine/notifications';
import { ReactNode, useMemo } from 'react';
import { SWRConfig } from 'swr';
import { useAuthContext } from './lib/Auth/authContext';
import { AppContext } from './lib/useAppContext';

export default function AppProvider({ children }: { children: ReactNode }) {
	const { fetcher } = useAuthContext();

	const isSupportCapture = useMemo(
		() => document.createElement('input').capture !== undefined,
		[]
	);
	const isMobile = useMatches(
		{ base: true, sm: false },
		{ getInitialValueInEffect: false }
	);

	return (
		<AppContext.Provider
			value={{
				isMobile,
				isSupportCapture,
				pinned: true,
				fetcher,
			}}
		>
			<Notifications position={isMobile ? 'bottom-center' : 'top-right'} />
			<SWRConfig
				value={{
					fetcher: (url: string) => fetcher.get(url).then((e) => e.data),
				}}
			>
				{children}
			</SWRConfig>
		</AppContext.Provider>
	);
}
