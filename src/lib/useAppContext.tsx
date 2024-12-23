import { createContext, useContext } from 'react';

export type AppContext = {
	createEntryOpened: boolean;
	createEntryControl: {
		open: () => void;
		close: () => void;
	};
	isMobile: boolean;
	isSupportCapture: boolean;
	pinned: boolean;
};

export const AppContext = createContext<AppContext>(null as any);
export const useAppContext = () => useContext(AppContext);
