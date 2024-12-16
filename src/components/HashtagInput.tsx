import { TagsInput, TagsInputProps } from '@mantine/core';
import { HashIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import styles from '../styles/HashtagInput.module.css';
import useSWR from 'swr';
import { useDebouncedValue } from '@mantine/hooks';
import { fetcher } from '../lib/fetcher';

type AutocompleteData = { id: number; name: string };

export default forwardRef<HTMLInputElement, TagsInputProps>(
	function HashtagInput(props, ref) {
		const [searchValue, setSearchValue] = useState('');
		const [debouncedValue] = useDebouncedValue(searchValue, 300);

		const { data } = useSWR<AutocompleteData[]>(
			debouncedValue.length > 1
				? '/tags/autocomplete?q=' + debouncedValue
				: null,
			fetcher,
			{ keepPreviousData: true }
		);

		return (
			<TagsInput
				ref={ref}
				comboboxProps={{ shadow: 'xs' }}
				placeholder="Tambah Tag"
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				leftSection={<HashIcon size="18" />}
				classNames={{
					wrapper: styles.wrapper,
					section: styles.section,
					input: styles.input,
				}}
				data={data?.map((e) => e.name) || []}
				{...props}
			/>
		);
	}
);
