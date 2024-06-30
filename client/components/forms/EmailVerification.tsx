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
import { sendVerificationEmail } from '../../app/services/emailServices';

const EmailVerification = ({ email }: { email: string }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(true);
  const [loading, setLoading] = useState(false);

  const { toPrev } = useFunnel();

  const handleEmailSendResult = (result: {
    success: boolean;
    error?: string;
  }) => {
    if (result.success) {
      setIsSending(false);
    } else {
      setIsSending(false);
      setMessage(`Error: ${result.error}`);
    }
  };

  useEffect(() => {
    const initiateEmailSend = async () => {
      const result = await sendVerificationEmail({ email });
      handleEmailSendResult(result);
    };

    initiateEmailSend();
  }, [email]);

  const handleResendVerificationEmail = async () => {
    if (!email) return;

    setLoading(true);
    setIsSending(true);
    setMessage(null);
    await sendVerificationEmail({ email });
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
              onClick={handleResendVerificationEmail}
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
              onClick={handleResendVerificationEmail}
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
