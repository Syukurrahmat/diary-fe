import { Loader } from '@mantine/core';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, Suspense } from 'react';

interface IconProps extends Omit<LucideProps, 'ref'> {
	name: keyof typeof dynamicIconImports;
}

export default function LucideIconLazy({ name, ...props }: IconProps) {
	const LucideIcon = lazy(dynamicIconImports[name]);

	return (
		<Suspense fallback={<Loader color="gray" size="sm" />}>
			<LucideIcon {...props} />
		</Suspense>
	);
}
