'use client';

import React, { useState } from 'react';
import GoBackButton from '@/components/button/GoBackButton';
import { Content, Header } from '@/components/common';
import { TEmailSchema } from '@/lib/validators/auth-validators';
import EmailForm from '@/components/forms/EmailForm';
import EmailVerification from '@/components/forms/EmailVerification';
import { FunnelProvider, useFunnel } from '@/providers/FunnelProvider';
import SignUpForm from '@/components/forms/SignUpForm';

const SignUpWithEmail = () => {
  const [email, setEmail] = useState<TEmailSchema['email']>();

  const steps = ['email-input-step', 'email-verification', 'sign-up-final'];

  return (
    <FunnelProvider steps={steps}>
      <Content>
        <StepManager email={email} setEmail={setEmail} />
      </Content>
    </FunnelProvider>
  );
};

const StepManager = ({
  email,
  setEmail,
}: {
  email: string | undefined;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { step, toFirst, toPrev, hasPrev, hasNext } = useFunnel();

  return (
    <>
      <Header>
        <GoBackButton
          onClick={hasNext ? toFirst : hasPrev ? toPrev : undefined}
        />
      </Header>
      <>
        {step === 'email-input-step' && <EmailForm setEmail={setEmail} />}
        {step === 'email-verification' && <EmailVerification email={email} />}
        {step === 'sign-up-final' && <SignUpForm email={email} />}
      </>
    </>
  );
};

export default SignUpWithEmail;
