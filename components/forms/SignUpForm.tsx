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
  const formSchema = z
    .object({
      name: z.string({ required_error: "Name is required." }),
      username: z.string({ required_error: "Username is required." }),
      email: z
        .string({ required_error: "Email is required." })
        .email({ message: "Not a valid email address." }),
      password: z
        .string({ required_error: "Password is required." })
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, {
          message: "Password must be less than 100 characters long.",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number.",
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Password must contain at least one special character.",
        }),
      passwordConfirm: z.string({
        required_error: "Password confirmation is required.",
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match.",
      path: ["passwordConfirm"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
