import { Center, Loader } from "@mantine/core";

export default function LoadingScreen() {
	return (
		<Center bg="#f8f9fa" h="100dvh">
			<Loader size="sm" color="gray" stroke="30" />
		</Center>
	);
}
