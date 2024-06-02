import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import tw from "tailwind-styled-components";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  form: UseFormReturn<T>;
  placeholder: string;
}

const FormInput = <T extends FieldValues>({
  name,
  form,
  placeholder,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <StyledInput placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;

const StyledInput = tw(
  Input
)`border border-gray-400 rounded-xl h-12 text-black placeholder:text-gray-500`;
