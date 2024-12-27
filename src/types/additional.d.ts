import { UseFormReturnType } from "@mantine/form";

type UseFormType<T = any> = UseFormReturnType<T, (values: T) => CreateEntryForm>

interface ICreateFormSection {
	form: UseFormType<CreateEntryForm>;
 }