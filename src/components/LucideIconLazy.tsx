import { Loader } from '@mantine/core';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { ComponentType, lazy, useEffect, useState } from 'react';

interface IconProps extends Omit<LucideProps, 'ref'> {
	name: keyof typeof dynamicIconImports;
}
const iconCache: Record<string, ComponentType | null> = {};

export default function LucideIconLazy({ name, ...props }: IconProps) {
	const [LucideIcon, setLucideIcon] = useState<ComponentType | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (iconCache[name]) {
			setLucideIcon(iconCache[name]);
			setIsLoaded(true);
		} else {
			setLucideIcon(lazy(dynamicIconImports[name]));
			const loadIcon = dynamicIconImports[name]();
			loadIcon.then((module) => {
				iconCache[name] = module.default;
				setLucideIcon(module.default);
				setIsLoaded(true);
			});
		}
	}, [name]);

	if (!isLoaded) return <Loader color="gray" size={props.size || 'sm'} />;
	return LucideIcon ? <LucideIcon {...props} /> : null;
}
