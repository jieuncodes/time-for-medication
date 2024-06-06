"use client";

import tw from "tailwind-styled-components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/inputs/FormInput";
import { Form } from "@/components/ui/form";
import { RoundButton } from "components/atoms/button/icon-button/RoundButton";
import { LinkText } from "components/common";

const SignUpForm = () => {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required." }),
    username: z.string({ required_error: "Username is required." }),
    email: z.string({ required_error: "Email is required." }).email({
      message: "Not a valid email address.",
    }),
    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, {
        message: "Password must be at least 8 characters long.",
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <RowForms>
            <FormInput name="name" form={form} label="Name" />
            <FormInput name="username" form={form} label="Username" />
          </RowForms>
          <ColForms>
            <FormInput name="email" form={form} label="Email" />
            <FormInput
              name="password"
              form={form}
              placeholder="6+ charaters"
              label="Password"
            />
          </ColForms>

          <LoginButton>Create Account</LoginButton>

          <Options>
            {`Already have an account?`}
            <LinkText href="/login">{`Sign In`}</LinkText>
          </Options>
        </form>
      </Form>
    </FormContainer>
  );
};

export default SignUpForm;

const FormContainer = tw.div`
  mt-4
  flex
  w-full
  flex-col
  pb-20
`;
const Options = tw.div`
  h-fit-content
  mt-4
  flex
  w-full
  items-center
  justify-center
  gap-2
`;
const LoginButton = tw(RoundButton)`
  mt-12
  border-none
  bg-blue-500
  text-white
  hover:bg-blue-600
`;

const RowForms = tw.div`
  grid
  grid-cols-2
  gap-4
`;
const ColForms = tw.div`
  mt-8
  grid
  grid-cols-1
  gap-8
`;
