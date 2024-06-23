'use client';

import React, { useState, FC } from 'react';
import GoBackButton from '@/components/button/GoBackButton';
import { Content, Header } from '@/components/common';
import { TEmailSchema } from '@/lib/validators/auth-validators';
import EmailForm from '@/components/forms/EmailForm';
import EmailVerification from '@/components/forms/EmailVerification';
import { FunnelProvider, useFunnel } from '@/providers/FunnelProvider';
import SignUpForm from '@/components/forms/SignUpForm';

interface SignUpWithEmailProps {
  steps: string[];
}

const SignUpWithEmail: FC<SignUpWithEmailProps> = () => {
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

interface StepManagerProps {
  email: string | undefined;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const StepManager: FC<StepManagerProps> = ({ email, setEmail }) => {
  const { step, toFirst, toPrev, hasPrev, hasNext } = useFunnel();

  return (
    <>
      <Header>
        <GoBackButton
          onClick={hasNext ? toFirst : hasPrev ? toPrev : undefined}
        />
      </Header>
      {getStepComponent(step, email, setEmail)}
    </>
  );
};

const getStepComponent = (
  step: string,
  email: string | undefined,
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  switch (step) {
    case 'email-input-step':
      return <EmailForm setEmail={setEmail} />;
    case 'email-verification':
      return <EmailVerification email={email} />;
    case 'sign-up-final':
      return <SignUpForm email={email} />;
    default:
      return null;
  }
};

export default SignUpWithEmail;
