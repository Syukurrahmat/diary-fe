import { AnimatePresence, AnimatePresenceProps, motion } from 'motion/react';
import { createContext, forwardRef, ReactNode, useContext } from 'react';

type SlideSectionCtx = {
	allowInitialMotion?: boolean;
	active: number | string;
};

type SlideSection = AnimatePresenceProps &
	SlideSectionCtx & { children: ReactNode };

const SlideSectionContext = createContext<SlideSectionCtx>(null as any);

export default function SlideSection({
	active,
	allowInitialMotion = true,
	...props
}: SlideSection) {
	return (
		<SlideSectionContext.Provider value={{ active, allowInitialMotion }}>
			<AnimatePresence mode="popLayout" {...props} />
		</SlideSectionContext.Provider>
	);
}

interface SlideSectionItem {
	value: string | number;
	children: ReactNode;
}

export const SlideSectionItem = forwardRef(
	({ value, children }: SlideSectionItem, ref) => {
		const { active, allowInitialMotion } = useContext(SlideSectionContext);
		const isMain = value === 0 || value === 'main';

		return (
			active == value && (
				<motion.div
                    key={value.toString()}
					ref={ref as any}
					initial={
						allowInitialMotion && {
							x: isMain ? '-100%' : '100%',
							opacity: 0,
						}
					}
					exit={{
						x: isMain ? '-100%' : '100%',
						opacity: 0,
					}}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.3 }}
					children={children}
				/>
			)
		);
	}
);
