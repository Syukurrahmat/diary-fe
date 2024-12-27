import { createContext, useContext } from 'react';

export type AppContext = {
	 
	isMobile: boolean;
	isSupportCapture: boolean;
	pinned: boolean;
 };

export const AppContext = createContext<AppContext>(null as any);
export const useAppContext = () => useContext(AppContext);
