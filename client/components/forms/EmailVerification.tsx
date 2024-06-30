import Lottie from 'lottie-react';
import emailSend from '@/public/lottie/email-send.json';
import {
  FullHeightFunnelWrapper,
  FunnelDesc,
  FunnelError,
  FunnelTitle,
} from '@/styles/funnel.styles';
import { ButtonsBox, LottieWrapper } from '../common';
import { OTPInputs } from './OTPInputs';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useFunnel } from '@/providers/FunnelProvider';
import { sendVerificationEmail } from '../../app/services/emailServices';

const EmailVerification = ({ email }: { email: string }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expirationTime, setExpirationTime] = useState<Date>();

  const { toPrev } = useFunnel();

  const handleEmailSendResult = (result: {
    success: boolean;
    expirationTime?: Date;
    error?: string;
  }) => {
    if (result.success) {
      setIsSending(false);
      setExpirationTime(result.expirationTime);
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

    try {
      const result = await sendVerificationEmail({ email });
      handleEmailSendResult(result);
    } catch (error) {
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
            <Button
              label="Try other email"
              onClick={() => toPrev()}
              loading={loading}
              size={'full'}
              variant="outline"
            />
            <Button
              label="Resend"
              loading={loading}
              onClick={handleResendVerificationEmail}
              size={'full'}
              disabled={loading}
            />
          </ButtonsBox>
        </>
      ) : (
        !isSending && (
          <>
            <FunnelTitle>Verification code</FunnelTitle>
            <FunnelDesc>{`Enter the verification code sent to ${email}`}</FunnelDesc>

            <OTPInputs
              email={email}
              expirationTime={expirationTime}
              handleResendVerificationEmail={handleResendVerificationEmail}
            />

            <Button
              label="Didn't receive the email yet?"
              onClick={handleResendVerificationEmail}
              variant={'link'}
              className="mt-6"
            />
          </>
        )
      )}
    </FullHeightFunnelWrapper>
  );
};
export default EmailVerification;
