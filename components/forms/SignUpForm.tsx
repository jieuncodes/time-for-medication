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
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const onSubmit = async (values: TSignUpSchema) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const data = await response.json();
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  const onError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <ColForms>
            <FormInput name="username" form={form} label="Username" />
            <FormInput name="email" form={form} label="Email" />
            <FormInput
              name="password"
              form={form}
              placeholder="6+ characters"
              label="Password"
              type="password"
            />
            <FormInput
              name="passwordConfirm"
              form={form}
              placeholder="Confirm Password"
              moreStyles={`-mt-3`}
              type="password"
            />
          </ColForms>

          <LoginButton type="submit">Create Account</LoginButton>

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
