"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "components/inputs/FormInput";
import { Form } from "components/ui/form";
import { LinkText } from "components/common";
import {
  FormContainer,
  ColForms,
  Options,
  LoginButton,
} from "./SignUpForm.styles";
import {
  SignUpSchema,
  TSignUpSchema,
} from "../../lib/validators/auth-validators";

const SignUpForm = () => {
  const defaultValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const onSubmit = (values: TSignUpSchema) => {
    console.log(values);
  };

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ColForms>
            <FormInput name="name" form={form} label="Name" />
            <FormInput name="username" form={form} label="Username" />
            <FormInput name="email" form={form} label="Email" />
            <FormInput
              name="password"
              form={form}
              placeholder="6+ charaters"
              label="Password"
            />
            <FormInput
              name="passwordConfirm"
              form={form}
              placeholder="Confirm Password"
              moreStyles={`-mt-3`}
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
