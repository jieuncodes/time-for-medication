import Lottie from 'lottie-react';
import emailSend from '@/public/lottie/email-send.json';
import {
  CenteredFunnelTitle,
  FullHeightFunnelWrapper,
  FunnelDesc,
  FunnelError,
} from '@/styles/funnel.styles';
import { ButtonsBox, LottieWrapper } from '../common';
import { InputOTPForm } from './InputOTP';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import LoadingSpinner from '../icons/LoadingSpinner';
import { Send } from 'lucide-react';

const EmailVerification = ({ email }: { email: string }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email sent successfully');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };

  useEffect(() => {
    sendVerificationEmail();
  }, []);

  return (
    <FullHeightFunnelWrapper className="pt-6">
      <LottieWrapper>
        <Lottie animationData={emailSend} />
      </LottieWrapper>
      {message ? (
        <>
          <CenteredFunnelTitle>
            Oops...!
            <br />
            Something went wrong.
          </CenteredFunnelTitle>

          <FunnelError>{message}</FunnelError>

          <ButtonsBox>
            <Button size={'full'} disabled={loading} variant="outline">
              {loading && <LoadingSpinner />}
              Try other email
            </Button>
            <Button size={'full'} disabled={loading}>
              {loading && <LoadingSpinner />}
              Resend
            </Button>
          </ButtonsBox>
        </>
      ) : (
        <>
          <CenteredFunnelTitle>Verification code</CenteredFunnelTitle>

          <FunnelDesc>{`Enter the verification code sent to ${email}`}</FunnelDesc>
          <InputOTPForm />
        </>
      )}
    </FullHeightFunnelWrapper>
  );
};
export default EmailVerification;
