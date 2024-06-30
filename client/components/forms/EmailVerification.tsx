import Lottie from 'lottie-react';
import emailSend from '@/public/lottie/email-send.json';
import {
  FullHeightFunnelWrapper,
  FunnelDesc,
  FunnelError,
  FunnelTitle,
} from '@/styles/funnel.styles';
import { ButtonsBox, LottieWrapper } from '../common';
import { InputOTPForm } from './InputOTP';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import LoadingSpinner from '../icons/LoadingSpinner';
import { useFunnel } from '@/providers/FunnelProvider';
import { set } from 'zod';

const EmailVerification = ({ email }: { email: string }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(true);
  const [loading, setLoading] = useState(false);

  const { toPrev } = useFunnel();

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
        setIsSending(false);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log('catched');
      setMessage('An unexpected error occurred.');
      setIsSending(false);
    }
  };

  useEffect(() => {
    sendVerificationEmail();
  }, []);

  const resendVerificationEmail = async () => {
    setLoading(true);
    setIsSending(true);
    setMessage(null);
    await sendVerificationEmail();
    setLoading(false);
  };

  return (
    <FullHeightFunnelWrapper className="pt-6">
      <LottieWrapper>
        <Lottie animationData={emailSend} />
      </LottieWrapper>
      {isSending && (
        <FunnelTitle className="text-center">Sending Email...</FunnelTitle>
      )}

      {!isSending && message ? (
        <>
          <FunnelTitle>
            Oops...!
            <br />
            Something went wrong.
          </FunnelTitle>

          <FunnelError>{message}</FunnelError>

          <ButtonsBox>
            <Button onClick={() => toPrev()} size={'full'} variant="outline">
              {loading && <LoadingSpinner />}
              Try other email
            </Button>
            <Button
              onClick={resendVerificationEmail}
              size={'full'}
              disabled={loading}
            >
              {loading && <LoadingSpinner />}
              Resend
            </Button>
          </ButtonsBox>
        </>
      ) : (
        !isSending && (
          <>
            <FunnelTitle>Verification code</FunnelTitle>

            <FunnelDesc>{`Enter the verification code sent to ${email}`}</FunnelDesc>
            <InputOTPForm />
            <Button
              onClick={resendVerificationEmail}
              variant={'link'}
              className="mt-6"
            >
              Didn't receive the email yet?
            </Button>
          </>
        )
      )}
    </FullHeightFunnelWrapper>
  );
};
export default EmailVerification;
