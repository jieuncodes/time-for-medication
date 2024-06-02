import tw from "tailwind-styled-components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "components/atoms/inputs/FormInput";
import { Form } from "@/components/ui/form";
import { RoundButton } from "components/atoms/button/icon-button/RoundButton";

const LoginForm = () => {
  const formSchema = z.object({
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

const FormContainer = tw.div`w-full mt-4 `;
const Options = tw.div`flex justify-between items-center mt-2`;
const RememberMe = tw.label`flex items-center space-x-2 text-gray-400 mb-4 ml-2`;
const ForgotPassword = tw.a`text-sm text-gray-400 hover:text-gray-200 cursor-pointer mb-4`;
const LoginButton = tw(
  RoundButton
)`mt-4 bg-blue-500 text-white rounded-full h-12 border-none hover:bg-blue-600 hover:text-white `;

const Label = tw.label`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`;
