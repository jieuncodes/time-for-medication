'use client';

import tw from 'tailwind-styled-components';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import FormInput from '@/components/inputs/FormInput';
import { Form } from '@/components/ui/form';
import { RoundButton } from '@/components/button/RoundButton';

const LoginForm = () => {
  const formSchema = z.object({
    email: z.string({ required_error: 'Email is required.' }).email({
      message: 'Not a valid email address.',
    }),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(8, {
        message: 'Password must be at least 8 characters long.',
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="email" form={form} placeholder="Email" />
          <FormInput name="password" form={form} placeholder="Password" />
          <Options>
            <RememberMe>
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </RememberMe>
            <ForgotPassword>Forgot password?</ForgotPassword>
          </Options>

          <LoginButton>Log In</LoginButton>
        </form>
      </Form>
    </FormContainer>
  );
};

export default LoginForm;

const FormContainer = tw.div`
  mt-4
  w-full
`;
const Options = tw.div`
  mt-2
  flex
  items-center
  justify-between
`;
const RememberMe = tw.label`
  mb-4
  ml-2
  flex
  items-center
  space-x-2
  text-gray-400
`;
const ForgotPassword = tw.a`
  mb-4
  cursor-pointer
  text-sm
  text-gray-400
  hover:text-gray-200
`;
const LoginButton = tw(RoundButton)`
  mt-4
  h-12
  rounded-full
  border-none
  bg-blue-500
  text-white
  hover:bg-blue-600
  hover:text-white
`;

const Label = tw.label`
  text-sm
  font-medium
  leading-none
  peer-disabled:cursor-not-allowed
  peer-disabled:opacity-70
`;
