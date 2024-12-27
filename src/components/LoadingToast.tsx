import toastStyle from '../styles/simpleToast.module.css';
import { notifications } from '@mantine/notifications';
import { CheckIcon, TriangleAlertIcon } from 'lucide-react';

export const LoadingToast = (message: string) => {
	const id = notifications.show({
		message,
		autoClose: false,
		withCloseButton: false,
		loading: true,
		classNames : toastStyle,
		color: 'dark',
		mih: '48px',
	});

	setTimeout(() => {
		notifications.update({
			id,
			message,
			withCloseButton: true,
		});
	}, 10000);


	return {
		id,
		success: (message: string) => {
			notifications.update({
				id,
				message,
				icon: <CheckIcon size="20" color="white" />,
				withCloseButton: true,
				loading: false,
				autoClose: 2000,
			});
		},
		failed: (message: string) => {
			notifications.update({
				id,
				message,
				icon: <TriangleAlertIcon size="20" color="white" />,
				withCloseButton: true,
				loading: false,
				color: 'red',
				autoClose: 2000,
			});
		},
	};
};
