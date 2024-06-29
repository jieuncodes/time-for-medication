import Lottie from 'lottie-react';
import emailSend from '@/public/lottie/email-send.json';
import { FunnelDesc, FunnelTitle, FunnelWrapper } from '@/styles/funnel.styles';
import { LottieWrapper } from '../common';
import { InputOTPForm } from './InputOTP';
import { useEffect, useState } from 'react';

const EmailVerification = ({ email }: { email: string }) => {
  const [message, setMessage] = useState('');

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject: 'Verify your email',
          message: 'Please click the link to verify your email address.',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email sent successfully');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    }
  };

  useEffect(() => {
    sendVerificationEmail();
  }, []);

  return (
    <FunnelWrapper>
      <LottieWrapper>
        <Lottie animationData={emailSend} loop={false} />
      </LottieWrapper>
      <FunnelTitle>Verification code</FunnelTitle>
      <FunnelDesc>{`Enter the verification code sent to ${email}`}</FunnelDesc>
      <InputOTPForm />
    </FunnelWrapper>
  );
};
export default EmailVerification;
