import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import tw from 'tailwind-styled-components';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  form: UseFormReturn<T>;
  placeholder?: string;
  label?: string;
  moreStyles?: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}

const FormInput = <T extends FieldValues>({
  name,
  form,
  placeholder,
  label,
  moreStyles,
  type = 'text',
  disabled = false,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={moreStyles}>
          <FormControl>
            <>
              {label && <Label htmlFor={name}>{label}</Label>}
              <StyledInput
                placeholder={placeholder}
                {...field}
                type={type}
                disabled={disabled}
              />
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
  user-select-none
  h-12
  select-none
  rounded-xl
  border
  border-gray-300
  pl-4
  text-black
  placeholder:text-gray-400
`;

const Label = tw.label`
  font-bold
  text-black
`;
