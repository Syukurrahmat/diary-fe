import { ActionIcon, Button, Group, Modal, Paper, Stack, Text, ThemeIcon } from '@mantine/core'; //prettier-ignore
import arrayMoveImmutable from 'array-move';
import { Edit2Icon, GripVertical, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useModalDiscloure } from '../../../lib/hooks';
import { useAppContext } from '../../../lib/useAppContext';
import modalStyles from '../../../styles/myModal.module.css';
import { failedToast, successToast } from '../../LoadingToast';
import LucideIconLazy from '../../LucideIconLazy';

export default function EditHabit() {
	const { fetcher } = useAppContext();
	const [opened, { open }] = useModalDiscloure(false);
	const navigate = useNavigate();
	const { data = [], mutate } = useSWR<Habit[]>('/habits');

	const onSortEnd = (oldIndex: number, newIndex: number) => {
		const oldData = [...data];

		const newData = arrayMoveImmutable(data, oldIndex, newIndex).map(
			(item, i) => ({
				...item,
				order: i,
			})
		);

		mutate(newData, { revalidate: false });

		const orderChanged = newData
			.filter((itemB) => {
				const e = oldData.find((item) => item.id === itemB.id);
				return e && e.order !== itemB.order;
			})
			.map(({ id, order }) => ({ id, order }));

		if (orderChanged.length > 0) {
			fetcher
				.patch('/habits/order', orderChanged)
				.then((e) => console.log(e))
				.catch((e) => {
					console.log(e);
					mutate(oldData, { revalidate: false });
				});
		}
	};

	const deleteHandler = async (id: number) => {
		return fetcher
			.delete(`/habits/${id}`)
			.then(() => {
				successToast('Berhasil dihapus');
				mutate(data && data.filter((e) => e.id !== id), {
					revalidate: false,
				});
			})
			.catch(() => failedToast('Opss, ada yang salah. Gagal dihapus'));
	};

	const editHandler = (id: number) => {
		console.log(id)
	};

	return (
		<>
			<Button onClick={open} variant="light">
				Edit
			</Button>
			<Modal
				title="Edit Habit"
				opened={opened}
				size="lg"
				transitionProps={{ duration: 250, transition: 'fade-up' }}
				onClose={() => navigate(-1)}
				classNames={modalStyles}
			>
				<SortableList
					onSortEnd={onSortEnd}
					className="list"
					draggedItemClassName="dragged"
				>
					<Stack p="md" gap="6">
						{data?.map((e) => (
							<SortableItem key={e.id}>
								<div className="item">
									<Paper
										withBorder
										component={Group}
										p="8"
										gap="sm"
										style={{ userSelect: 'none' }}
									>
										<SortableKnob>
											<GripVertical
												size="20"
												color="var(--mantine-color-gray-5)"
											/>
										</SortableKnob>
										<ThemeIcon
											color={e.color}
											variant="light"
											radius="sm"
											size="md"
											children={
												<LucideIconLazy
													name={e.icon as any}
													size="18"
												/>
											}
										/>
										<Text flex="1" fz="sm">
											{e.name}
										</Text>
										<ActionGroup
											onEdit={() => editHandler(e.id)}
											onDelete={() => deleteHandler(e.id)}
										/>
									</Paper>
								</div>
							</SortableItem>
						))}
					</Stack>
				</SortableList>
			</Modal>
		</>
	);
}

interface ActionGroup {
	onEdit: () => void;
	onDelete: () => Promise<void>;
}

function ActionGroup({ onDelete, onEdit }: ActionGroup) {
	const [isConfirmDelete, setIsConfirmDelete] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	return (
		<Group gap="xs">
			{!isConfirmDelete ? (
				<>
					<ActionIcon
						size="md"
						radius="sm"
						variant="light"
						onClick={onEdit}
						children={<Edit2Icon size="16" />}
					/>
					<ActionIcon
						size="md"
						radius="sm"
						variant="light"
						color="red"
						onClick={() => setIsConfirmDelete(true)}
						children={<Trash2Icon size="16" />}
					/>
				</>
			) : (
				<>
					<Button
						size="xs"
						h="28"
						variant="light"
						color="gray"
						onClick={() => setIsConfirmDelete(false)}
					>
						Batal
					</Button>
					<Button
						size="xs"
						h="28"
						color="red"
						loading={isDeleting}
						onClick={() => {
							setIsDeleting(true);
							onDelete().finally(() => {
								setIsConfirmDelete(false);
								setIsConfirmDelete(false);
							});
						}}
					>
						Hapus
					</Button>
				</>
			)}
		</Group>
	);
}
