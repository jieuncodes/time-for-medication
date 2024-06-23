import Lottie from 'lottie-react';
import emailSend from '@/public/lottie/email-send.json';
import { FunnelDesc, FunnelTitle, FunnelWrapper } from '@/styles/funnel.styles';

import { LottieWrapper } from '../common';

import { InputOTPForm } from './InputOTP';

const EmailVerification = ({ email }: { email: string }) => {
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
