'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/inputs/FormInput';
import { Form } from '@/components/ui/form';
import { FormContainer, ColForms, LoginButton } from './SignUpForm.styles';
import {
  SignUpSchema,
  TSignUpSchema,
} from '../../lib/validators/auth-validators';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingSpinner from '../icons/LoadingSpinner';
import { FunnelTitle } from '@/styles/funnel.styles';

const SignUpForm = ({ email }: { email: string | undefined }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: '',
    email: email || '',
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

      console.log('value', values);
      // router.push('/login');
    } catch (error) {
      console.error('Form submission error:', error);
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FunnelTitle className=" mb-12">Finish your signup process</FunnelTitle>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ColForms>
            <FormInput
              name="username"
              form={form}
              label="Username"
              disabled={loading}
              autoComplete="false"
            />
            <FormInput name="email" form={form} label="Email" disabled />
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
        </form>
      </Form>
    </FormContainer>
  );
};

export default SignUpForm;
