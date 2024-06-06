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
  placeholder?: string;
  label?: string;
}

const FormInput = <T extends FieldValues>({
  name,
  form,
  placeholder,
  label,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <>
              {label && <Label htmlFor={name}>{label}</Label>}
              <StyledInput placeholder={placeholder} {...field} />
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;

const StyledInput = tw(Input)`
  text-md
  h-12
  rounded-xl
  border
  border-gray-300
  pl-6
  text-black
  placeholder:text-gray-400
`;

const Label = tw.label`
  font-bold
  text-black
`;
