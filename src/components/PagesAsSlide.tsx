import { Box, BoxComponentProps, Group } from '@mantine/core';
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

interface PagesAsSlide {
	activepage: string;
	children: React.ReactNode;
}

const PagesAsSlideContext = createContext<string>('');

export default function PagesSlide({ children, activepage }: PagesAsSlide) {
	const ref = useRef<HTMLDivElement>(null);
	const [pageNames, setPageNames] = useState<string[]>([]);

	useEffect(() => {
		if (ref.current) {
			setPageNames(
				Array
				.from(ref.current.querySelectorAll('[data-page-slide-item]'))
				.map((e) => e.getAttribute('data-page-name')) as string[] //prettier-ignore
			);
		}
	}, []);
	return (
		<PagesAsSlideContext.Provider value={activepage}>
			<Box pos="relative" maw="100%" style={{ overflow: 'hidden' }}>
				<Group
					ref={ref}
					wrap="nowrap"
					gap="0"
					className="pagesAsSlideWrapper"
					align="start"
					style={{
						transform: `translateX(-${
							(pageNames?.indexOf(activepage) || 0) * 100
						}%)`,
						transition: 'all 300ms',
					}}
				>
					{children}
				</Group>
			</Box>
		</PagesAsSlideContext.Provider>
	);
}

interface PagesAsSlideItem extends BoxComponentProps {
	pageName: string;
	children: React.ReactNode;
	component?: any;
}

export function PagesAsSlideItem({ pageName, ...props }: PagesAsSlideItem) {
	const activepage = useContext(PagesAsSlideContext);

	return (
		<Box
			component={props.component}
			h={activepage == pageName ? props.h || 'auto' : '0px'}
			maw="100%"
			miw="100%"
			flex="1"
			data-page-name={pageName}
			data-page-slide-item
			{...props}
		/>
	);
}
