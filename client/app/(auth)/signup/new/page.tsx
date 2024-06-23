'use client';
import createFunnel from '@/components/Funnel/createFunnel';
import GoBackButton from '@/components/button/GoBackButton';
import { Content, LinkText, Title } from '@/components/common';
import SignUpForm from '@/components/forms/SignUpForm';
import {
  FormContainer,
  ColForms,
  Options,
  LoginButton,
} from '@/components/forms/SignUpForm.styles';
import tw from 'tailwind-styled-components';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SignUpSchema, TSignUpSchema } from '@/lib/validators/auth-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/inputs/FormInput';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { Button } from '@/components/ui/button';
import EmailForm from '@/components/forms/EmailForm';

export default function SignUpWithEmail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const { Funnel, Step, useFunnel } = createFunnel([
    'email-input-step',
    'email-verification',
  ] as const);
  const { step, hasNext, hasPrev, setStep, toNext, toPrev } = useFunnel();

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
    <Content>
      <Header>
        <GoBackButton />
      </Header>
      <Form {...form}>
        <Funnel step={step}>
          <Step name="email-input-step">
            <EmailForm toNext={toNext} />
          </Step>
          <Step name="email-verification">asdf</Step>
        </Funnel>
      </Form>
      {/* <Title>Sign up to MedTime</Title>
      <SignUpForm /> */}
    </Content>
  );
}

const FunnelTitle = tw.h1`
  mb-4
  text-2xl
  font-semibold
`;
const Header = tw.div`
  relative
  mb-4
  mt-2
  flex
  h-12
  w-full
  items-center
`;
