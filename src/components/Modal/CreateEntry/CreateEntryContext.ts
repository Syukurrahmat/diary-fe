import { UseFormReturnType } from "@mantine/form";
import { createContext, useContext } from "react";

type CreateEntryContext = {
	form: UseFormReturnType<CreateEntryForm, (values: CreateEntryForm) => CreateEntryForm>
	opened: boolean,
	close: () => void
	open: () => void
}

export const CreateEntryContext = createContext<CreateEntryContext>(
	null as any
);

export const useCreateEntryModal = () => useContext(CreateEntryContext);
