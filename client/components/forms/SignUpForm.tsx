'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/inputs/FormInput';
import { Form } from '@/components/ui/form';
import { LinkText } from '@/components/common';
import {
  FormContainer,
  ColForms,
  Options,
  LoginButton,
} from './SignUpForm.styles';
import {
  SignUpSchema,
  TSignUpSchema,
} from '../../lib/validators/auth-validators';
import { ErrorProps } from 'next/error';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingSpinner from '../icons/LoadingSpinner';

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const onSubmit = async (values: TSignUpSchema) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('errorData', errorData);

        //TODO: handle error messages for email and username
        form.setError('username', { message: errorData.message });

        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Form submission error:', error);
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ColForms>
            <FormInput
              name="username"
              form={form}
              label="Username"
              disabled={loading}
            />
            <FormInput
              name="email"
              form={form}
              label="Email"
              disabled={loading}
            />
            <FormInput
              name="password"
              form={form}
              placeholder="6+ characters"
              label="Password"
              type="password"
              disabled={loading}
            />
            <FormInput
              name="passwordConfirm"
              form={form}
              placeholder="Confirm Password"
              moreStyles={`-mt-3`}
              type="password"
              disabled={loading}
            />
          </ColForms>

          <LoginButton type="submit" disabled={loading}>
            {loading && <LoadingSpinner />}
            Create Account
          </LoginButton>

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
